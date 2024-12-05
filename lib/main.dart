import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'screens/auth/login_screen.dart';
import 'screens/admin/admin_dashboard.dart';
import 'screens/user/user_dashboard.dart';
import 'screens/admin/create_order_screen.dart';
import 'config/firebase_options.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'services/auth_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables
  await dotenv.load(fileName: ".env");
  
  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
  // Set persistence to LOCAL
  await FirebaseAuth.instance.setPersistence(Persistence.LOCAL);
  
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bohurupi',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        brightness: Brightness.light,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
      ),
      home: const AuthWrapper(),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/admin': (context) => const AdminDashboard(),
        '/admin/users': (context) => const AdminDashboard(),
        '/admin/content': (context) => const AdminDashboard(),
        '/admin/analytics': (context) => const AdminDashboard(),
        '/admin/settings': (context) => const AdminDashboard(),
        '/admin/help': (context) => const AdminDashboard(),
        '/user': (context) => const UserDashboard(),
        '/user/orders': (context) => const UserDashboard(),
        '/user/notifications': (context) => const UserDashboard(),
        '/user/profile': (context) => const UserDashboard(),
        '/user/help': (context) => const UserDashboard(),
        '/admin/create-order': (context) => const CreateOrderScreen(),
      },
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        // Show loading indicator while checking auth state
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        // If user is logged in
        if (snapshot.hasData && snapshot.data != null) {
          return FutureBuilder<UserRole>(
            future: AuthService.getUserRole(snapshot.data!.uid),
            builder: (context, roleSnapshot) {
              if (roleSnapshot.connectionState == ConnectionState.waiting) {
                return const Scaffold(
                  body: Center(
                    child: CircularProgressIndicator(),
                  ),
                );
              }

              if (roleSnapshot.hasError) {
                return const LoginScreen(); // Return to login if error
              }

              // Navigate based on user role
              return roleSnapshot.data == UserRole.admin
                  ? const AdminDashboard()
                  : const UserDashboard();
            },
          );
        }

        // If user is not logged in
        return const LoginScreen();
      },
    );
  }
}
