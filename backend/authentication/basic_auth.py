from supabase import create_client, Client
from fastapi import HTTPException, Header
import os
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv('supabase_url') 
supabase_key = os.getenv('supabase_key')


supabase: Client = create_client(supabase_url=supabase_url, supabase_key=supabase_key)

async def verify_token(authorization: str = Header(...)):
    token = authorization.split(" ")[1]
    try:
        user = supabase.auth.get_user(token)
        if user is None:
            print(f"User is none : {user} , {token}")
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user
    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail=str(e))
