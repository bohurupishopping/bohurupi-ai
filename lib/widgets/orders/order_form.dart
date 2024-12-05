import 'package:flutter/material.dart';
import '../../services/woo_commerce_service.dart';
import 'product_selection_dialog.dart';
import '../../services/woo_products_service.dart';

class OrderForm extends StatefulWidget {
  final Function(Map<String, dynamic>) onSubmit;
  final List<WooOrder> wooOrders;

  const OrderForm({
    Key? key,
    required this.onSubmit,
    required this.wooOrders,
  }) : super(key: key);

  @override
  State<OrderForm> createState() => _OrderFormState();
}

class _OrderFormState extends State<OrderForm> {
  final _formKey = GlobalKey<FormState>();
  final _orderIdController = TextEditingController();
  final _customerNameController = TextEditingController();
  final _trackingIdController = TextEditingController();
  String _selectedOrderStatus = 'pending';
  String _selectedPaymentStatus = 'Prepaid';
  List<Map<String, dynamic>> _selectedProducts = [];
  bool _isLoading = false;
  String? _error;
  WooOrder? _fetchedOrder;

  // Define status options as a constant
  static const List<String> orderStatusOptions = [
    'pending',
    'processing',
    'completed',
    'cancelled',
    'on-hold',
  ];

  static const List<String> paymentStatusOptions = [
    'Prepaid',
    'COD',
  ];

  @override
  void dispose() {
    _orderIdController.dispose();
    _customerNameController.dispose();
    _trackingIdController.dispose();
    super.dispose();
  }

  Future<void> _fetchOrderDetails() async {
    final orderId = _orderIdController.text.trim();
    if (orderId.isEmpty) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final order = await WooCommerceService.getOrder(orderId);
      setState(() {
        _fetchedOrder = order;
        _populateFormWithOrder(order);
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<Map<String, dynamic>?> _fetchProductDetails(String productId) async {
    try {
      return await WooProductsService.getProductById(productId);
    } catch (e) {
      print('Error fetching product details: $e');
      return null;
    }
  }

  void _populateFormWithOrder(WooOrder order) async {
    _orderIdController.text = order.number;
    _customerNameController.text = '${order.billing.firstName} ${order.billing.lastName}'.trim();
    
    setState(() {
      _selectedOrderStatus = orderStatusOptions.contains(order.status)
          ? order.status
          : 'pending';
          
      _selectedPaymentStatus = (order.paymentMethodTitle ?? '').toLowerCase().contains('cod')
          ? 'COD'
          : 'Prepaid';
    });

    // Process each line item and fetch product details
    final updatedProducts = <Map<String, dynamic>>[];
    
    for (var item in order.lineItems) {
      final productDetails = await _fetchProductDetails(item.productId.toString());
      
      if (productDetails != null) {
        updatedProducts.add({
          'orderName': item.name,
          'details': item.name,
          'sku': item.sku,
          'qty': item.quantity,
          'sale_price': double.tryParse(item.total)?.toDouble() ?? 0.0,
          'product_page_url': productDetails['product_page_url'] ?? '',
          'product_category': productDetails['product_category'] ?? '',
          'image': productDetails['image'] ?? '',
          'colour': item.metaData
              .firstWhere(
                (meta) => meta.key == 'pa_color',
                orElse: () => WooMeta(
                  id: 0,
                  key: '',
                  value: '',
                  displayKey: '',
                  displayValue: '',
                ),
              )
              .value,
          'size': item.metaData
              .firstWhere(
                (meta) => meta.key == 'pa_size',
                orElse: () => WooMeta(
                  id: 0,
                  key: '',
                  value: '',
                  displayKey: '',
                  displayValue: '',
                ),
              )
              .value,
        });
      }
    }

    if (mounted) {
      setState(() {
        _selectedProducts = updatedProducts;
      });
    }
  }

  void _handleSubmit() {
    if (_formKey.currentState?.validate() ?? false) {
      final orderData = {
        'orderId': _orderIdController.text,
        'customerName': _customerNameController.text,
        'trackingId': _trackingIdController.text,
        'status': _selectedOrderStatus,
        'orderstatus': _selectedPaymentStatus,
        'products': _selectedProducts,
        'designUrl': '', // Default empty string
        'createdAt': DateTime.now().toIso8601String(),
      };

      widget.onSubmit(orderData);
      _resetForm();
    }
  }

  void _resetForm() {
    _orderIdController.clear();
    _customerNameController.clear();
    _trackingIdController.clear();
    setState(() {
      _selectedOrderStatus = 'pending';
      _selectedPaymentStatus = 'Prepaid';
      _selectedProducts = [];
      _fetchedOrder = null;
      _error = null;
    });
  }

  double _calculateTotal() {
    return _selectedProducts.fold(0.0, (sum, product) {
      return sum + (product['sale_price'] as double) * (product['qty'] as int);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.blue.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // WooCommerce Order Search
            _buildSectionTitle('Search WooCommerce Order', Icons.search),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _orderIdController,
                    decoration: InputDecoration(
                      labelText: 'Order ID',
                      hintText: 'Enter WooCommerce order ID',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    validator: (value) {
                      if (value?.isEmpty ?? true) return 'Please enter order ID';
                      return null;
                    },
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: _isLoading ? null : _fetchOrderDetails,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 16,
                    ),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Fetch Order'),
                ),
              ],
            ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  _error!,
                  style: const TextStyle(color: Colors.red),
                ),
              ),

            const SizedBox(height: 24),
            // Basic Order Information
            _buildSectionTitle('Order Information', Icons.info_outline),
            const SizedBox(height: 16),
            _buildTextField(
              controller: _customerNameController,
              label: 'Customer Name',
              validator: (value) {
                if (value?.isEmpty ?? true) return 'Please enter customer name';
                return null;
              },
            ),
            const SizedBox(height: 16),
            _buildTextField(
              controller: _trackingIdController,
              label: 'Tracking ID',
              // Optional field, no validator needed
            ),

            const SizedBox(height: 24),
            // Order Status Section
            _buildSectionTitle('Order Details', Icons.shopping_cart),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildDropdown(
                    label: 'Order Status',
                    value: _selectedOrderStatus,
                    items: orderStatusOptions,
                    onChanged: (value) {
                      if (value != null) setState(() => _selectedOrderStatus = value);
                    },
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildDropdown(
                    label: 'Payment Status',
                    value: _selectedPaymentStatus,
                    items: paymentStatusOptions,
                    onChanged: (value) {
                      if (value != null) setState(() => _selectedPaymentStatus = value);
                    },
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),
            // Products Section
            _buildSectionTitle('Products', Icons.inventory),
            const SizedBox(height: 16),
            _buildProductsList(),

            const SizedBox(height: 24),
            // Total and Submit
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Total: ₹${_calculateTotal().toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
                ElevatedButton(
                  onPressed: _handleSubmit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 32,
                      vertical: 16,
                    ),
                  ),
                  child: Text(
                    _fetchedOrder != null ? 'Update Order' : 'Create Order',
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: Colors.blue, size: 20),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.blue,
          ),
        ),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    TextInputType? keyboardType,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.blue),
        ),
      ),
      validator: validator,
    );
  }

  Widget _buildDropdown({
    required String label,
    required String value,
    required List<String> items,
    required void Function(String?) onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: Colors.blue),
        ),
      ),
      items: items.map((item) {
        return DropdownMenuItem(
          value: item,
          child: Text(item.toUpperCase()),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }

  Widget _buildProductsList() {
    return Column(
      children: [
        // Product selection button
        ElevatedButton.icon(
          onPressed: () => _showProductSelectionDialog(),
          icon: const Icon(Icons.add),
          label: const Text('Add Product'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(
              horizontal: 24,
              vertical: 12,
            ),
          ),
        ),
        const SizedBox(height: 16),
        // Selected products list
        ..._selectedProducts.map((product) => _buildProductCard(product)),
      ],
    );
  }

  Widget _buildProductCard(Map<String, dynamic> product) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: product['image']?.isNotEmpty == true
            ? Image.network(
                product['image'] as String,
                width: 48,
                height: 48,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(Icons.shopping_bag, color: Colors.blue.shade700),
                ),
              )
            : Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(Icons.shopping_bag, color: Colors.blue.shade700),
              ),
        title: Text(product['orderName'] as String? ?? ''),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Qty: ${product['qty']} × ₹${product['sale_price']}'),
            if (product['size']?.isNotEmpty == true || product['colour']?.isNotEmpty == true)
              Text('Size: ${product['size']}, Color: ${product['colour']}'),
            if (product['product_category']?.isNotEmpty == true)
              Text('Category: ${product['product_category']}'),
          ],
        ),
        isThreeLine: true,
        trailing: IconButton(
          icon: const Icon(Icons.delete, color: Colors.red),
          onPressed: () {
            setState(() {
              _selectedProducts.remove(product);
            });
          },
        ),
      ),
    );
  }

  void _showProductSelectionDialog() {
    showDialog(
      context: context,
      builder: (context) => ProductSelectionDialog(
        onProductSelected: (product, quantity) {
          setState(() {
            _selectedProducts.add({
              ...product,
              'qty': quantity,
            });
          });
        },
      ),
    );
  }
} 