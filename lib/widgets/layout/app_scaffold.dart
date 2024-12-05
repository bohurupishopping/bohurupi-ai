import 'package:flutter/material.dart';
import '../sidebar/app_sidebar.dart';

class AppScaffold extends StatelessWidget {
  final List<NavItem> mainItems;
  final List<NavItem> supportItems;
  final String currentPath;
  final String userEmail;
  final VoidCallback onLogout;
  final Widget body;
  final Function(String) onNavigate;

  const AppScaffold({
    Key? key,
    required this.mainItems,
    required this.supportItems,
    required this.currentPath,
    required this.userEmail,
    required this.onLogout,
    required this.body,
    required this.onNavigate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // App Bar with menu button
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Builder(
          builder: (context) => IconButton(
            icon: Icon(
              Icons.menu,
              color: Theme.of(context).brightness == Brightness.dark 
                  ? Colors.white 
                  : Colors.grey[800],
            ),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
      ),
      // Drawer with custom styling
      drawer: ClipRRect(
        borderRadius: const BorderRadius.only(
          topRight: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
        child: Drawer(
          backgroundColor: Colors.transparent,
          elevation: 0,
          child: Container(
            decoration: BoxDecoration(
              color: Theme.of(context).scaffoldBackgroundColor,
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
            ),
            child: AppSidebar(
              mainItems: mainItems,
              supportItems: supportItems,
              currentPath: currentPath,
              userEmail: userEmail,
              onLogout: () {
                Navigator.of(context).pop(); // Close drawer first
                onLogout();
              },
              onNavigate: (route) {
                Navigator.of(context).pop(); // Close drawer first
                onNavigate(route);
              },
            ),
          ),
        ),
      ),
      // Main content with gesture detection for swipe
      body: GestureDetector(
        onHorizontalDragEnd: (details) {
          if (details.primaryVelocity! > 0) {
            // Swipe right to open drawer
            Scaffold.of(context).openDrawer();
          }
        },
        child: body,
      ),
    );
  }
} 