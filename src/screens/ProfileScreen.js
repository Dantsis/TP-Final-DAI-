
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ensureAnonAuth } from '../services/auth';

export default function ProfileScreen() {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, used: 0, active: 0 });


  const initials = useMemo(() => (uid ? 'AN' : '—'), [uid]);


  const shortUid = useMemo(() => {
    if (!uid) return '';
    if (uid.length <= 10) return uid;
    return `${uid.slice(0, 4)}…${uid.slice(-4)}`;
  }, [uid]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
    });
    return unsub;
  }, []);

  const loadStats = async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const q = query(collection(db, 'tickets'), where('ownerUid', '==', uid));
      const snap = await getDocs(q);
      let total = 0, used = 0;
      snap.forEach((d) => {
        total += 1;
        const data = d.data();
        if (data?.status === 'used' || data?.usedAt) used += 1;
      });
      const active = total - used;
      setStats({ total, used, active });
    } catch (e) {
      Alert.alert('Error', String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) loadStats();
  }, [uid]);

  const handleRefresh = () => loadStats();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);

      await ensureAnonAuth();
      Alert.alert('Sesión reiniciada', 'Sesión anónima nueva iniciada.');
    } catch (e) {
      Alert.alert('Error al cerrar sesión', String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      {}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#1f2937',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
            borderWidth: 1,
            borderColor: '#334155',
          }}
        >
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>Perfil</Text>
          <Text style={{ color: colors.mutted, marginTop: 4 }}>
            Autenticado: <Text style={{ color: '#a7f3d0' }}>Anónimo</Text>
          </Text>
          {!!shortUid && (
            <Text style={{ color: colors.mutted }}>
              UID: <Text style={{ color: '#93c5fd' }}>{shortUid}</Text>
            </Text>
          )}
        </View>
      </View>

      {}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: spacing.lg }}>
        <StatCard label="Entradas" value={stats.total} />
        <StatCard label="Disponibles" value={stats.active} />
        <StatCard label="Usadas" value={stats.used} />
      </View>

      {}
      <View style={{ gap: 12 }}>
        <PrimaryButton title={loading ? 'Actualizando…' : 'Refrescar'} onPress={handleRefresh} disabled={loading} />
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#374151',
            alignItems: 'center',
            backgroundColor: '#111827',
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fca5a5', fontWeight: '700' }}>Cerrar sesión anónima</Text>
          )}
        </TouchableOpacity>
      </View>

      {}
      <View style={{ marginTop: spacing.lg, padding: spacing.md, backgroundColor: '#0b1220', borderRadius: 12, borderWidth: 1, borderColor: '#1f2a44' }}>
        <Text style={{ color: colors.mutted }}>
          Consejo: generá tus tickets desde el detalle del evento y volvé acá para ver cuántos
          tenés activos o usados. Las imágenes de QR guardadas aparecen en Storage.
        </Text>
      </View>
    </View>
  );
}

function StatCard({ label, value }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0b1220',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#1f2a44',
      }}
    >
      <Text style={{ color: colors.mutted, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{value}</Text>
    </View>
  );
}

