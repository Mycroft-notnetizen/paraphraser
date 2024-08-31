def extract_name_or_email(user_data):
    # Attempt to extract the name from the identity data
    if hasattr(user_data, 'identities'):
        for identity in user_data.identities:
            identity_data = identity.identity_data
            name = identity_data.get('name') if isinstance(identity_data, dict) else None
            if name:
                return name

    # If name is not found, return the email
    return user_data.email if hasattr(user_data, 'email') else None