import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/woo_commerce_product.dart';

class WooOrder {
  final String id;
  final String number;
  final String status;
  final String total;
  final String currency;
  final DateTime dateCreated;
  final List<WooOrderItem> lineItems;
  final WooAddress billing;
  final WooAddress shipping;
  final String customerNote;
  final String paymentMethodTitle;
  final String transactionId;
  final String shippingTotal;
  final String totalTax;
  final String discountTotal;

  WooOrder({
    required this.id,
    required this.number,
    required this.status,
    required this.total,
    required this.currency,
    required this.dateCreated,
    required this.lineItems,
    required this.billing,
    required this.shipping,
    required this.customerNote,
    required this.paymentMethodTitle,
    required this.transactionId,
    required this.shippingTotal,
    required this.totalTax,
    required this.discountTotal,
  });

  factory WooOrder.fromJson(Map<String, dynamic> json) {
    return WooOrder(
      id: json['id'].toString(),
      number: json['number'].toString(),
      status: json['status'],
      total: json['total'],
      currency: json['currency'],
      dateCreated: DateTime.parse(json['date_created']),
      lineItems: (json['line_items'] as List)
          .map((item) => WooOrderItem.fromJson(item))
          .toList(),
      billing: WooAddress.fromJson(json['billing']),
      shipping: WooAddress.fromJson(json['shipping']),
      customerNote: json['customer_note'] ?? '',
      paymentMethodTitle: json['payment_method_title'],
      transactionId: json['transaction_id'] ?? '',
      shippingTotal: json['shipping_total'],
      totalTax: json['total_tax'],
      discountTotal: json['discount_total'],
    );
  }
}

class WooOrderItem {
  final String id;
  final String name;
  final int quantity;
  final String total;
  final String sku;
  final List<WooMeta> metaData;
  final int productId;

  WooOrderItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.total,
    required this.sku,
    required this.metaData,
    required this.productId,
  });

  factory WooOrderItem.fromJson(Map<String, dynamic> json) {
    return WooOrderItem(
      id: json['id'].toString(),
      name: json['name'],
      quantity: json['quantity'],
      total: json['total'],
      sku: json['sku'] ?? '',
      metaData: (json['meta_data'] as List)
          .map((meta) => WooMeta.fromJson(meta))
          .toList(),
      productId: json['product_id'] as int,
    );
  }
}

class WooMeta {
  final int id;
  final String key;
  final String value;
  final String displayKey;
  final String displayValue;

  WooMeta({
    required this.id,
    required this.key,
    required this.value,
    required this.displayKey,
    required this.displayValue,
  });

  factory WooMeta.fromJson(Map<String, dynamic> json) {
    return WooMeta(
      id: json['id'],
      key: json['key'],
      value: json['value'].toString(),
      displayKey: json['display_key'],
      displayValue: json['display_value'],
    );
  }
}

class WooAddress {
  final String firstName;
  final String lastName;
  final String address1;
  final String address2;
  final String city;
  final String state;
  final String postcode;
  final String country;
  final String email;
  final String phone;

  WooAddress({
    required this.firstName,
    required this.lastName,
    required this.address1,
    required this.address2,
    required this.city,
    required this.state,
    required this.postcode,
    required this.country,
    required this.email,
    required this.phone,
  });

  factory WooAddress.fromJson(Map<String, dynamic> json) {
    return WooAddress(
      firstName: json['first_name'],
      lastName: json['last_name'],
      address1: json['address_1'],
      address2: json['address_2'] ?? '',
      city: json['city'],
      state: json['state'],
      postcode: json['postcode'],
      country: json['country'],
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
    );
  }
}

class WooCommerceService {
  static final String _baseUrl = dotenv.env['WOO_URL'] ?? '';
  static final String _consumerKey = dotenv.env['WOO_CONSUMER_KEY'] ?? '';
  static final String _consumerSecret = dotenv.env['WOO_CONSUMER_SECRET'] ?? '';

  static Map<String, String> get _headers {
    final basicAuth = base64Encode(utf8.encode('$_consumerKey:$_consumerSecret'));
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic $basicAuth',
    };
  }

  static Future<Map<String, dynamic>> getOrders({
    int page = 1,
    int perPage = 25,
    String? status,
    String? search,
  }) async {
    final queryParams = {
      'page': page.toString(),
      'per_page': perPage.toString(),
      'consumer_key': _consumerKey,
      'consumer_secret': _consumerSecret,
      if (status != null && status != 'any') 'status': status,
      if (search != null && search.isNotEmpty) 'search': search,
    };

    final uri = Uri.parse('$_baseUrl/wp-json/wc/v3/orders').replace(
      queryParameters: queryParams,
    );

    try {
      final response = await http.get(uri);
      
      if (response.statusCode == 200) {
        final List<dynamic> ordersJson = json.decode(response.body);
        final orders = ordersJson.map((json) => WooOrder.fromJson(json)).toList();
        
        final totalPages = int.parse(
          response.headers['x-wp-totalpages'] ?? '1',
        );

        return {
          'orders': orders,
          'totalPages': totalPages,
        };
      } else {
        throw Exception('Failed to load orders');
      }
    } catch (e) {
      throw Exception('Error fetching orders: $e');
    }
  }

  static Future<Map<String, dynamic>> getProducts({
    int page = 1,
    String? search,
    String? status,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'per_page': '20',
        'consumer_key': _consumerKey,
        'consumer_secret': _consumerSecret,
        if (search != null && search.isNotEmpty) 'search': search,
        if (status != null && status != 'any') 'status': status,
      };

      final uri = Uri.parse('$_baseUrl/wp-json/wc/v3/products')
          .replace(queryParameters: queryParams);
      
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> productsJson = json.decode(response.body);
        final products = productsJson
            .map((json) => WooCommerceProduct.fromJson(json))
            .toList();

        final totalPages = int.parse(
          response.headers['x-wp-totalpages'] ?? '1',
        );

        return {
          'products': products,
          'totalPages': totalPages,
        };
      } else {
        throw Exception('Failed to load products: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in getProducts: $e');
      rethrow;
    }
  }

  static Future<WooCommerceProduct> getProduct(String productId) async {
    try {
      // Use query parameters instead of headers for authentication
      final queryParams = {
        'consumer_key': _consumerKey,
        'consumer_secret': _consumerSecret,
      };

      // Build URL with query parameters
      final uri = Uri.parse('$_baseUrl/wp-json/wc/v3/products/$productId')
          .replace(queryParameters: queryParams);
      
      // Make request without headers
      final response = await http.get(uri);
      print('Product API URL: $uri'); // Debug URL

      if (response.statusCode == 200) {
        final productData = json.decode(response.body);
        print('Product API Response: $productData'); // Debug response
        
        // Extract category info if available
        String categoryName = '';
        String categorySlug = '';
        int categoryId = 0;
        
        if (productData['categories'] != null && 
            (productData['categories'] as List).isNotEmpty) {
          final category = productData['categories'][0];
          categoryName = category['name'] ?? '';
          categorySlug = category['slug'] ?? '';
          categoryId = category['id'] ?? 0;
        }

        // Map response to WooCommerceProduct
        return WooCommerceProduct(
          id: productData['id'],
          name: productData['name'] ?? '',
          sku: productData['sku'] ?? '',
          description: productData['description'] ?? '',
          shortDescription: productData['short_description'] ?? '',
          permalink: productData['permalink'] ?? '',
          price: productData['price']?.toString() ?? '0',
          regularPrice: productData['regular_price']?.toString() ?? '0', 
          salePrice: productData['sale_price']?.toString() ?? '0',
          onSale: productData['on_sale'] ?? false,
          status: productData['status'] ?? 'publish',
          images: (productData['images'] as List<dynamic>?)
                  ?.map((e) => WooProductImage.fromJson(e as Map<String, dynamic>))
                  .toList() ??
              [],
          categories: [
            WooProductCategory(
              id: categoryId,
              name: categoryName,
              slug: categorySlug,
            ),
          ],
        );
      } else {
        print('Product API Error Response: ${response.body}'); // Debug error
        throw Exception('Failed to load product: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in getProduct: $e');
      rethrow;
    }
  }

  static Future<List<WooCommerceProduct>> searchProducts(String query) async {
    try {
      final queryParams = {
        'search': query,
        'consumer_key': _consumerKey,
        'consumer_secret': _consumerSecret,
      };

      final uri = Uri.parse('$_baseUrl/wp-json/wc/v3/products')
          .replace(queryParameters: queryParams);
      
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final List<dynamic> productsJson = json.decode(response.body);
        return productsJson
            .map((json) => WooCommerceProduct.fromJson(json))
            .toList();
      } else {
        throw Exception('Failed to search products: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in searchProducts: $e');
      rethrow;
    }
  }

  static Future<WooOrder> getOrder(String orderId) async {
    try {
      final queryParams = {
        'consumer_key': _consumerKey,
        'consumer_secret': _consumerSecret,
      };

      final uri = Uri.parse('$_baseUrl/wp-json/wc/v3/orders/$orderId')
          .replace(queryParameters: queryParams);

      final response = await http.get(uri);

      if (response.statusCode == 200) {
        return WooOrder.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to load order: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in getOrder: $e');
      rethrow;
    }
  }

  static Future<String> getProductCategory(int categoryId) async {
    try {
      final queryParams = {
        'consumer_key': _consumerKey,
        'consumer_secret': _consumerSecret,
      };

      final uri = Uri.parse(
        '$_baseUrl/wp-json/wc/v3/products/categories/$categoryId'
      ).replace(queryParameters: queryParams);
      
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['name'] ?? '';
      }
      return '';
    } catch (e) {
      print('Error getting category: $e');
      return '';
    }
  }
} 