import 'package:flutter/material.dart';
import '../../services/woo_commerce_service.dart';
import '../../models/woo_commerce_product.dart';

class ProductSelectionDialog extends StatefulWidget {
  final Function(Map<String, dynamic>, int) onProductSelected;

  const ProductSelectionDialog({
    Key? key,
    required this.onProductSelected,
  }) : super(key: key);

  @override
  State<ProductSelectionDialog> createState() => _ProductSelectionDialogState();
}

class _ProductSelectionDialogState extends State<ProductSelectionDialog> {
  bool _isLoading = true;
  String? _error;
  List<WooCommerceProduct> _products = [];
  final _searchController = TextEditingController();
  final _quantityController = TextEditingController(text: '1');
  WooCommerceProduct? _selectedProduct;

  @override
  void initState() {
    super.initState();
    _fetchProducts();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _quantityController.dispose();
    super.dispose();
  }

  Future<void> _fetchProducts() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final result = await WooCommerceService.getProducts();
      setState(() {
        _products = result['products'];
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _searchProducts(String query) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final products = await WooCommerceService.searchProducts(query);
      setState(() {
        _products = products;
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _handleProductSelection() {
    if (_selectedProduct != null) {
      final quantity = int.tryParse(_quantityController.text) ?? 1;
      widget.onProductSelected({
        'id': _selectedProduct!.id,
        'name': _selectedProduct!.name,
        'sku': _selectedProduct!.sku,
        'sale_price': double.parse(_selectedProduct!.salePrice),
        'product_page_url': _selectedProduct!.permalink,
        'categories': _selectedProduct!.categories.map((c) => c.name).join(', '),
      }, quantity);
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        width: MediaQuery.of(context).size.width * 0.9,
        height: MediaQuery.of(context).size.height * 0.8,
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Select Product',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Search Field
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search products...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              onChanged: (value) {
                if (value.isEmpty) {
                  _fetchProducts();
                } else {
                  _searchProducts(value);
                }
              },
            ),
            const SizedBox(height: 16),

            // Products List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _error != null
                      ? Center(child: Text('Error: $_error'))
                      : ListView.builder(
                          itemCount: _products.length,
                          itemBuilder: (context, index) {
                            final product = _products[index];
                            final isSelected = _selectedProduct?.id == product.id;

                            return Card(
                              color: isSelected ? Colors.blue.shade50 : null,
                              child: ListTile(
                                leading: product.images.isNotEmpty
                                    ? Image.network(
                                        product.images.first.src,
                                        width: 48,
                                        height: 48,
                                        fit: BoxFit.cover,
                                      )
                                    : Container(
                                        width: 48,
                                        height: 48,
                                        color: Colors.grey.shade200,
                                        child: const Icon(Icons.image),
                                      ),
                                title: Text(product.name),
                                subtitle: Text(
                                  'SKU: ${product.sku}\nPrice: ₹${product.salePrice}',
                                ),
                                selected: isSelected,
                                onTap: () {
                                  setState(() {
                                    _selectedProduct = product;
                                  });
                                },
                              ),
                            );
                          },
                        ),
            ),

            // Quantity and Add Button
            if (_selectedProduct != null) ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _quantityController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Quantity',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  ElevatedButton(
                    onPressed: _handleProductSelection,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 16,
                      ),
                    ),
                    child: const Text(
                      'Add Product',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
} 