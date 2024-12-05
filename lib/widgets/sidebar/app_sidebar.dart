import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class NavItem {
  final String title;
  final IconData icon;
  final String route;

  NavItem({
    required this.title,
    required this.icon,
    required this.route,
  });
}

class AppSidebar extends StatelessWidget {
  final List<NavItem> mainItems;
  final List<NavItem> supportItems;
  final String currentPath;
  final String userEmail;
  final VoidCallback onLogout;
  final Function(String) onNavigate;

  const AppSidebar({
    Key? key,
    required this.mainItems,
    required this.supportItems,
    required this.currentPath,
    required this.userEmail,
    required this.onLogout,
    required this.onNavigate,
  }) : super(key: key);

  String getInitials(String email) {
    return email.split('@')[0][0].toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    // Define colors to handle null safety
    final backgroundColor = isDarkMode 
        ? (Colors.grey[900] ?? Colors.grey) 
        : Colors.white;
    final borderColor = isDarkMode 
        ? (Colors.grey[800] ?? Colors.grey) 
        : Colors.white;

    return Container(
      width: 280,
      color: Theme.of(context).scaffoldBackgroundColor,
      child: Column(
        children: [
          // Logo Section with improved gradient and blur effects
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: backgroundColor.withOpacity(0.4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: borderColor.withOpacity(0.4),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.deepPurple.withOpacity(0.1),
                  blurRadius: 20,
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  height: 44,
                  width: 44,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    gradient: const LinearGradient(
                      colors: [Colors.deepPurple, Colors.pink],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.deepPurple.withOpacity(0.3),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.auto_awesome,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ShaderMask(
                      shaderCallback: (bounds) => const LinearGradient(
                        colors: [Colors.deepPurple, Colors.pink],
                      ).createShader(bounds),
                      child: const Text(
                        'Bohurupi',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    Text(
                      'Dashboard',
                      style: TextStyle(
                        fontSize: 12,
                        color: isDarkMode 
                            ? (Colors.grey[400] ?? Colors.grey)
                            : (Colors.grey[600] ?? Colors.grey),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Main Navigation with improved blur and animations
          Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: backgroundColor.withOpacity(0.4),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: borderColor.withOpacity(0.4),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSection(context, 'Navigation', mainItems),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: Divider(
                        height: 32,
                        color: isDarkMode 
                            ? (Colors.grey[800] ?? Colors.grey)
                            : (Colors.grey[300] ?? Colors.grey),
                      ),
                    ),
                    _buildSection(context, 'Support', supportItems),
                  ],
                ),
              ),
            ),
          ),

          // Profile Section with improved design
          Container(
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: backgroundColor.withOpacity(0.4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: borderColor.withOpacity(0.4),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                ),
              ],
            ),
            child: Column(
              children: [
                ListTile(
                  leading: Hero(
                    tag: 'profile-avatar',
                    child: CircleAvatar(
                      backgroundColor: Colors.deepPurple,
                      child: Text(
                        getInitials(userEmail),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  title: Text(
                    userEmail.split('@')[0],
                    style: const TextStyle(fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                  subtitle: Text(
                    userEmail,
                    style: TextStyle(
                      color: isDarkMode ? Colors.grey[400] : Colors.grey[600],
                      fontSize: 12,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.logout, color: Colors.red),
                  title: const Text(
                    'Logout',
                    style: TextStyle(
                      color: Colors.red,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  onTap: onLogout,
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    '© 2024 Bohurupi. All rights reserved.',
                    style: TextStyle(
                      fontSize: 11,
                      color: isDarkMode ? Colors.grey[500] : Colors.grey[600],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(BuildContext context, String title, List<NavItem> items) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: Text(
            title.toUpperCase(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isDarkMode ? Colors.grey[500] : Colors.grey[600],
              letterSpacing: 0.5,
            ),
          ),
        ),
        const SizedBox(height: 8),
        ...items.map((item) => _buildNavItem(context, item)),
      ],
    );
  }

  Widget _buildNavItem(BuildContext context, NavItem item) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final isSelected = currentPath == item.route;

    final unselectedColor = isDarkMode 
        ? (Colors.grey[800] ?? Colors.grey)
        : (Colors.grey[200] ?? Colors.grey);
    final textColor = isDarkMode 
        ? (Colors.grey[300] ?? Colors.grey)
        : (Colors.grey[800] ?? Colors.grey);
    final iconColor = isDarkMode 
        ? (Colors.grey[400] ?? Colors.grey)
        : (Colors.grey[600] ?? Colors.grey);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      margin: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        child: InkWell(
          borderRadius: BorderRadius.circular(12),
          onTap: () => onNavigate(item.route),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: isSelected
                  ? Colors.deepPurple
                  : unselectedColor,
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Colors.deepPurple
                        : unselectedColor,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: Colors.deepPurple.withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ]
                        : null,
                  ),
                  child: Icon(
                    item.icon,
                    size: 20,
                    color: isSelected ? Colors.white : iconColor,
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  item.title,
                  style: TextStyle(
                    color: isSelected
                        ? Colors.deepPurple
                        : textColor,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
} 