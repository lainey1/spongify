from flask import Blueprint, request, jsonify
from app.models import db, Restaurant

search_routes = Blueprint('search', __name__)

@search_routes.route('/')
def search():
    # Extract query parameters
    search_query = request.args.get('q', '').strip()  # For text-based search
    cuisine = request.args.get('cuisine', '').strip()  # Filter by cuisine
    max_price = request.args.get('max_price', None)  # Filter by price

    # print(search_query)
    # print(cuisine)
    # print(max_price)
    # print("Hello")

    # Pagination parameters
    page = request.args.get('page', 1, type=int)  # Current page (default: 1)
    per_page = request.args.get('per_page', 10, type=int)  # Items per page (default: 10)

    # Start with the base query
    query = Restaurant.query

    # Apply filters dynamically
    if search_query:
        query = query.filter(Restaurant.name.ilike(f"%{search_query}%"))
    if cuisine:
        query = query.filter(Restaurant.cuisine.ilike(f"%{cuisine}%"))
    if max_price:
        try:
            max_price = float(max_price)  # Ensure max_price is a float
            query = query.filter(Restaurant.price_point <= max_price)
        except ValueError:
            return jsonify({'error': 'Invalid price value'}), 400
    # Apply pagination
    paginated_results = query.paginate(page=page, per_page=per_page)

    # Prepare results with pagination metadata
    response = {
        "restaurants": [restaurant.to_dict() for restaurant in paginated_results.items],
        "total": paginated_results.total,
        "page": paginated_results.page,
        "pages": paginated_results.pages,
        "per_page": paginated_results.per_page
    }

    return jsonify({'response': response}), 200
