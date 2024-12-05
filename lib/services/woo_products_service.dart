import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/woo_commerce_product.dart';

class WooProductsService {
  static final String _baseUrl = dotenv.env['WOO_URL'] ?? '';
  static final String _consumerKey = dotenv.env['WOO_CONSUMER_KEY'] ?? '';
  static final String _consumerSecret = dotenv.env['WOO_CONSUMER_SECRET'] ?? '';

  // Get product details by ID
  static Future<Map<String, dynamic>> getProductById(String productId) async {
    try {
      final queryParams = {
        'consumer_key': _consumerKey,
        'consumer_secret': _consumerSecret,
      };

      final uri = Uri.parse('$_baseUrl/wp-json/wc/v3/products/$productId')
          .replace(queryParameters: queryParams);

      print('Fetching product from: $uri'); // Debug URL

      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final productData = json.decode(response.body);
        print('Product data: $productData'); // Debug response

        return {
          'id': productData['id'],
          'orderName': productData['name'] ?? '',
          'details': productData['name'] ?? '',
          'sku': productData['sku'] ?? '',
          'sale_price': double.tryParse(productData['price'] ?? '0') ?? 0.0,
          'product_page_url': productData['permalink'] ?? '',
          'product_category': productData['categories']?[0]?['name'] ?? '',
          'image': productData['images']?[0]?['src'] ?? '',
          'colour': _extractAttribute(productData, 'pa_color'),
          'size': _extractAttribute(productData, 'pa_size'),
        };
      } else {
        print('Product API Error: ${response.body}');
        throw Exception('Failed to load product: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in getProductById: $e');
      rethrow;
    }
  }

  // Helper method to extract attributes
  static String _extractAttribute(Map<String, dynamic> product, String attributeId) {
    try {
      if (product['attributes'] == null) return '';
      
      final attributes = product['attributes'] as List<dynamic>;
      final attribute = attributes.firstWhere(
        (attr) => attr['name']?.toLowerCase() == attributeId.toLowerCase(),
        orElse: () => null,
      );
      
      if (attribute == null) return '';
      
      if (attribute['option'] != null) {
        return attribute['option'].toString();
      }
      
      if (attribute['options'] is List && (attribute['options'] as List).isNotEmpty) {
        return attribute['options'][0].toString();
      }
      
      return '';
    } catch (e) {
      print('Error extracting attribute $attributeId: $e');
      return '';
    }
  }

  // Search products
  static Future<List<Map<String, dynamic>>> searchProducts(String query) async {
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
        return productsJson.map((product) => {
          'id': product['id'],
          'orderName': product['name'] ?? '',
          'details': product['name'] ?? '',
          'sku': product['sku'] ?? '',
          'sale_price': double.tryParse(product['price'] ?? '0') ?? 0.0,
          'product_page_url': product['permalink'] ?? '',
          'product_category': product['categories']?[0]?['name'] ?? '',
          'image': product['images']?[0]?['src'] ?? '',
          'colour': _extractAttribute(product, 'pa_color'),
          'size': _extractAttribute(product, 'pa_size'),
        }).toList();
      } else {
        print('Search API Error: ${response.body}');
        throw Exception('Failed to search products');
      }
    } catch (e) {
      print('Error in searchProducts: $e');
      rethrow;
    }
  }

  // Get product variations
  static Future<List<Map<String, dynamic>>> getProductVariations(String productId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/woocommerce/products/$productId/variations'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> variationsJson = json.decode(response.body);
        return variationsJson.map((variation) => {
          'id': variation['id'],
          'attributes': variation['attributes'] ?? [],
          'sale_price': double.tryParse(variation['sale_price'] ?? '0') ?? 0.0,
          'regular_price': double.tryParse(variation['regular_price'] ?? '0') ?? 0.0,
          'stock_status': variation['stock_status'] ?? '',
        }).toList();
      } else {
        print('Variations API Error: ${response.body}');
        throw Exception('Failed to load variations');
      }
    } catch (e) {
      print('Error in getProductVariations: $e');
      rethrow;
    }
  }

  // Get product categories
  static Future<List<Map<String, dynamic>>> getProductCategories() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/woocommerce/products/categories'),
      );

      if (response.statusCode == 200) {
        final List<dynamic> categoriesJson = json.decode(response.body);
        return categoriesJson.map((category) => {
          'id': category['id'],
          'name': category['name'] ?? '',
          'slug': category['slug'] ?? '',
          'count': category['count'] ?? 0,
        }).toList();
      } else {
        print('Categories API Error: ${response.body}');
        throw Exception('Failed to load categories');
      }
    } catch (e) {
      print('Error in getProductCategories: $e');
      rethrow;
    }
  }
} 