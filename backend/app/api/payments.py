from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
try:
    import stripe
    STRIPE_AVAILABLE = True
except ImportError:
    STRIPE_AVAILABLE = False
    stripe = None

from app.models.database import get_db
from app.models.models import User, Subscription
from app.core.auth import get_current_user
from app.core.config import settings

# Configure Stripe if available
if STRIPE_AVAILABLE and settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY

router = APIRouter()

@router.post("/create-checkout-session")
async def create_checkout_session(
    plan: str,  # 'premium' or 'pro'
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Stripe checkout session for subscription."""
    if not STRIPE_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment processing is currently unavailable"
        )
    
    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment service not configured"
        )
    
    try:
        # Define pricing based on plan
        prices = {
            'premium': 'price_premium_monthly',  # Replace with actual Stripe price ID
            'pro': 'price_pro_monthly'  # Replace with actual Stripe price ID
        }
        
        if plan not in prices:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid subscription plan"
            )
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            customer_email=current_user.email,
            payment_method_types=['card'],
            line_items=[{
                'price': prices[plan],
                'quantity': 1,
            }],
            mode='subscription',
            success_url='http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:3000/pricing',
            metadata={
                'user_id': str(current_user.id),
                'plan': plan
            }
        )
        
        return {'checkout_url': checkout_session.url}
        
    except Exception as e:
        if STRIPE_AVAILABLE and 'stripe.error.StripeError' in str(type(e)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stripe error: {str(e)}"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Payment processing error: {str(e)}"
            )

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events."""
    if not STRIPE_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment processing is currently unavailable"
        )
    
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except Exception as e:
        if 'SignatureVerificationError' in str(type(e)):
            raise HTTPException(status_code=400, detail="Invalid signature")
        else:
            raise HTTPException(status_code=400, detail="Webhook processing error")
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        await handle_successful_payment(session, db)
    
    elif event['type'] == 'invoice.payment_succeeded':
        invoice = event['data']['object']
        await handle_subscription_renewal(invoice, db)
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        await handle_subscription_cancellation(subscription, db)
    
    return {'status': 'success'}

async def handle_successful_payment(session, db: Session):
    """Handle successful payment from checkout session."""
    user_id = int(session['metadata']['user_id'])
    plan = session['metadata']['plan']
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return
    
    # Update user to premium
    user.is_premium = True
    
    # Create subscription record
    subscription = Subscription(
        user_id=user_id,
        stripe_customer_id=session['customer'],
        stripe_subscription_id=session['subscription'],
        status='active',
        plan_name=plan
    )
    
    db.add(subscription)
    db.commit()

async def handle_subscription_renewal(invoice, db: Session):
    """Handle subscription renewal."""
    subscription_id = invoice['subscription']
    
    # Update subscription status
    subscription = db.query(Subscription).filter(
        Subscription.stripe_subscription_id == subscription_id
    ).first()
    
    if subscription:
        subscription.status = 'active'
        db.commit()

async def handle_subscription_cancellation(stripe_subscription, db: Session):
    """Handle subscription cancellation."""
    subscription_id = stripe_subscription['id']
    
    # Update subscription and user status
    subscription = db.query(Subscription).filter(
        Subscription.stripe_subscription_id == subscription_id
    ).first()
    
    if subscription:
        subscription.status = 'canceled'
        
        # Update user premium status
        user = db.query(User).filter(User.id == subscription.user_id).first()
        if user:
            user.is_premium = False
        
        db.commit()

@router.get("/subscription")
async def get_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's subscription details."""
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == 'active'
    ).first()
    
    if not subscription:
        return {'has_subscription': False}
    
    return {
        'has_subscription': True,
        'plan': subscription.plan_name,
        'status': subscription.status,
        'current_period_end': subscription.current_period_end
    }

@router.post("/cancel-subscription")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel user's subscription."""
    if not STRIPE_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment processing is currently unavailable"
        )
    
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == 'active'
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )
    
    try:
        # Cancel subscription in Stripe
        stripe.Subscription.delete(subscription.stripe_subscription_id)
        
        # Update local subscription status
        subscription.status = 'canceled'
        current_user.is_premium = False
        
        db.commit()
        
        return {'message': 'Subscription canceled successfully'}
        
    except Exception as e:
        if STRIPE_AVAILABLE and 'stripe.error.StripeError' in str(type(e)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to cancel subscription: {str(e)}"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Subscription cancellation error: {str(e)}"
            )
