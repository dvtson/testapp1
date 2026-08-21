import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin', 'finance' hoặc 'guest'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Phân quyền cho tài khoản ẩn danh (Khách xem hồ sơ)
        if (currentUser.isAnonymous) {
          setRole('guest');
          setLoading(false);
          return;
        }

        try {
          // Lấy quyền từ Firestore Database
          const userRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            // Nếu đã có hồ sơ, lấy quyền từ DB
            setRole(docSnap.data().role);
          } else {
            // Auto-provisioning: Nếu chưa có, tự động tạo hồ sơ phân quyền
            // Tạm thời giữ lại test@2.com làm admin khởi điểm
            const initialRole = currentUser.email === 'test@2.com' ? 'admin' : 'finance';
            await setDoc(userRef, {
              email: currentUser.email,
              role: initialRole,
              createdAt: new Date()
            });
            setRole(initialRole);
          }
        } catch (error) {
          console.error("Lỗi khi đọc phân quyền từ Database:", error);
          // Fallback an toàn nếu rớt mạng
          setRole('finance');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
