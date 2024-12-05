class WooCommerceProduct {
  final int id;
  final String name;
  final String sku;
  final String description;
  final String shortDescription;
  final String permalink;
  final String price;
  final String regularPrice;
  final String salePrice;
  final bool onSale;
  final String status;
  final List<WooProductImage> images;
  final List<WooProductCategory> categories;

  WooCommerceProduct({
    required this.id,
    required this.name,
    required this.sku,
    required this.description,
    required this.shortDescription,
    required this.permalink,
    required this.price,
    required this.regularPrice,
    required this.salePrice,
    required this.onSale,
    required this.status,
    required this.images,
    required this.categories,
  });

  factory WooCommerceProduct.fromJson(Map<String, dynamic> json) {
    return WooCommerceProduct(
      id: json['id'] as int,
      name: json['name'] as String? ?? '',
      sku: json['sku'] as String? ?? '',
      description: json['description'] as String? ?? '',
      shortDescription: json['short_description'] as String? ?? '',
      permalink: json['permalink'] as String? ?? '',
      price: json['price'] as String? ?? '0',
      regularPrice: json['regular_price'] as String? ?? '0',
      salePrice: json['sale_price'] as String? ?? '0',
      onSale: json['on_sale'] as bool? ?? false,
      status: json['status'] as String? ?? 'publish',
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => WooProductImage.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      categories: (json['categories'] as List<dynamic>?)
              ?.map((e) => WooProductCategory.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class WooProductImage {
  final int id;
  final String src;
  final String name;
  final String alt;

  WooProductImage({
    required this.id,
    required this.src,
    required this.name,
    required this.alt,
  });

  factory WooProductImage.fromJson(Map<String, dynamic> json) {
    return WooProductImage(
      id: json['id'] as int? ?? 0,
      src: json['src'] as String? ?? '',
      name: json['name'] as String? ?? '',
      alt: json['alt'] as String? ?? '',
    );
  }
}

class WooProductCategory {
  final int id;
  final String name;
  final String slug;

  WooProductCategory({
    required this.id,
    required this.name,
    required this.slug,
  });

  factory WooProductCategory.fromJson(Map<String, dynamic> json) {
    return WooProductCategory(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      slug: json['slug'] as String? ?? '',
    );
  }
} 