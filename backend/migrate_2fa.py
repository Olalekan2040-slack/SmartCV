"""
Manual database migration script to add 2FA fields to users table.
Run this script to add the necessary 2FA columns to your existing database.
"""

import os
import sys
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def run_migration():
    """Add 2FA fields to users table."""
    
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL not found in environment variables")
        return False
    
    print(f"Connecting to database: {database_url[:30]}...")
    
    conn = None
    cursor = None
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        print("✅ Connected to database successfully")
        
        # Check if users table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        """)
        table_exists = cursor.fetchone()[0]
        
        if not table_exists:
            print("❌ Users table does not exist")
            return False
        
        print("✅ Users table found")
        
        # Add 2FA columns if they don't exist
        migration_queries = [
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_code VARCHAR(10);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_code_expires TIMESTAMP;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(100);"
        ]
        
        for i, query in enumerate(migration_queries, 1):
            print(f"Executing query {i}/5...")
            cursor.execute(query)
            print(f"✅ Query {i} completed")
        
        # Commit changes
        conn.commit()
        print("\n🎉 Migration completed successfully!")
        print("Added 2FA fields to users table:")
        print("- two_factor_enabled (BOOLEAN)")
        print("- two_factor_code (VARCHAR)")
        print("- two_factor_code_expires (TIMESTAMP)")
        print("- email_verified (BOOLEAN)")
        print("- email_verification_token (VARCHAR)")
        
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {str(e)}")
        if conn:
            conn.rollback()
        return False
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        if conn:
            conn.rollback()
        return False
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
        print("Database connection closed")

if __name__ == "__main__":
    print("🚀 Starting 2FA Migration...")
    print("=" * 50)
    
    success = run_migration()
    
    if success:
        print("\n🎉 Migration completed! You can now use 2FA features.")
    else:
        print("\n💥 Migration failed. Please check the error messages above.")
        sys.exit(1)
