from ..registry import register_service

def echo_handler(input_data, user):
    """
    Echo service - returns whatever input you send.
    This is a dummy service to test the generic handler.
    """
    message = input_data.get('message', 'No message provided')
    
    return {
        "echo": message,
        "user_id": str(user.id),
        "user_email": user.email,
        "service": "echo"
    }

# Register this service
register_service("echo", echo_handler)