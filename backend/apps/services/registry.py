# Service registry - plugins register here
_service_registry = {}

def register_service(name, handler_function):
    """Register a service handler function"""
    _service_registry[name] = handler_function
    print(f"✅ Service registered: {name}")

def get_service_handler(name):
    """Get registered service handler"""
    return _service_registry.get(name)

def list_services():
    """List all registered services"""
    return list(_service_registry.keys())