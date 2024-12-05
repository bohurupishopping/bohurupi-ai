import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

enum UserRole {
  admin,
  user,
}

class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Get current user
  static User? get currentUser => _auth.currentUser;

  // Check if user is logged in
  static bool get isLoggedIn => currentUser != null;

  static Future<UserRole> getUserRole(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      final data = doc.data();
      
      // If no document exists, create one with default user role
      if (!doc.exists || data == null) {
        await _firestore.collection('users').doc(uid).set({
          'role': 'user',
          'email': currentUser?.email,
          'createdAt': FieldValue.serverTimestamp(),
        });
        return UserRole.user;
      }
      
      return data['role'] == 'admin' ? UserRole.admin : UserRole.user;
    } catch (e) {
      print('Error getting user role: $e');
      return UserRole.user; // Default to user role if error
    }
  }

  // Sign out
  static Future<void> signOut() async {
    await _auth.signOut();
  }
} 