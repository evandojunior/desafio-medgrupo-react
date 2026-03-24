import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const APP_VERSION = '1.0.0';

export default function AboutScreen() {
  function openLink(url: string) {
    Linking.openURL(url);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>EJ</Text>
        </View>
        <View style={styles.avatarGlow} />
      </View>

      {/* Name & Role */}
      <Text style={styles.name}>Evando Junior</Text>
      <Text style={styles.role}>Desenvolvedor Mobile & Full Stack</Text>

      {/* Project description */}
      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionTitle}>Sobre o Projeto</Text>
        <Text style={styles.descriptionText}>
          Este app é um desafio técnico desenvolvido com React Native e Expo, demonstrando
          arquitetura limpa com Zustand, Expo Router e boas práticas de UI/UX em ambiente mobile.
          O objetivo é gerenciar lojas e seus produtos de forma intuitiva e eficiente.
        </Text>
      </View>

      {/* Links */}
      <View style={styles.linksSection}>
        <Text style={styles.sectionTitle}>Contato</Text>

        <Pressable
          onPress={() => openLink('https://linkedin.com/in/evandojuniordev')}
          style={({ pressed }) => [styles.linkCard, pressed && styles.linkCardPressed]}
        >
          <View style={[styles.linkIconContainer, styles.linkedinBg]}>
            <Ionicons name="logo-linkedin" size={22} color="#0A66C2" />
          </View>
          <View style={styles.linkInfo}>
            <Text style={styles.linkLabel}>LinkedIn</Text>
            <Text style={styles.linkUrl}>linkedin.com/in/evandojuniordev</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#444" />
        </Pressable>

        <Pressable
          onPress={() => openLink('https://github.com/evandojunior')}
          style={({ pressed }) => [styles.linkCard, pressed && styles.linkCardPressed]}
        >
          <View style={[styles.linkIconContainer, styles.githubBg]}>
            <Ionicons name="logo-github" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.linkInfo}>
            <Text style={styles.linkLabel}>GitHub</Text>
            <Text style={styles.linkUrl}>github.com/evandojuniordev</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#444" />
        </Pressable>
      </View>

      {/* Tech stack */}
      <View style={styles.techSection}>
        <Text style={styles.sectionTitle}>Tecnologias</Text>
        <View style={styles.techGrid}>
          {['React Native', 'Expo Router', 'TypeScript', 'Zustand', 'MirageJS', 'Gluestack UI'].map(
            (tech) => (
              <View key={tech} style={styles.techBadge}>
                <Text style={styles.techText}>{tech}</Text>
              </View>
            )
          )}
        </View>
      </View>

      {/* Footer version */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão {APP_VERSION}</Text>
        <Text style={styles.footerSubText}>Desafio Técnico — React Native</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  avatarText: {
    color: '#3B82F6',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  role: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  descriptionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 16,
    width: '100%',
    marginBottom: 28,
  },
  descriptionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 20,
  },
  linksSection: {
    width: '100%',
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  linkCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  linkCardPressed: {
    backgroundColor: '#222',
  },
  linkIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedinBg: {
    backgroundColor: 'rgba(10, 102, 194, 0.15)',
  },
  githubBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  linkInfo: {
    flex: 1,
  },
  linkLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  linkUrl: {
    color: '#6B7280',
    fontSize: 12,
  },
  techSection: {
    width: '100%',
    marginBottom: 32,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  techText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },
  footerSubText: {
    color: '#374151',
    fontSize: 11,
  },
});
