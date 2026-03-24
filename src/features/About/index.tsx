import React from 'react';
import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { aboutStyles as styles } from './style';

const APP_VERSION = '1.0.0';

export function AboutFeature() {
  function openLink(url: string) { Linking.openURL(url); }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}><Text style={styles.avatarText}>EJ</Text></View>
        <View style={styles.avatarGlow} />
      </View>
      <Text style={styles.name}>Evando Junior</Text>
      <Text style={styles.role}>Desenvolvedor Mobile & Full Stack</Text>

      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionTitle}>Sobre o Projeto</Text>
        <Text style={styles.descriptionText}>
          Este app é um desafio técnico desenvolvido com React Native e Expo, demonstrando
          arquitetura limpa com Zustand, Expo Router e boas práticas de UI/UX em ambiente mobile.
        </Text>
      </View>

      <View style={styles.linksSection}>
        <Text style={styles.sectionTitle}>Contato</Text>
        <Pressable onPress={() => openLink('https://linkedin.com/in/evandojuniordev')} style={({ pressed }) => [styles.linkCard, pressed && styles.linkCardPressed]}>
          <View style={[styles.linkIconContainer, styles.linkedinBg]}><Ionicons name="logo-linkedin" size={22} color="#0A66C2" /></View>
          <View style={styles.linkInfo}><Text style={styles.linkLabel}>LinkedIn</Text><Text style={styles.linkUrl}>linkedin.com/in/evandojuniordev</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#444" />
        </Pressable>
        <Pressable onPress={() => openLink('https://github.com/evandojunior')} style={({ pressed }) => [styles.linkCard, pressed && styles.linkCardPressed]}>
          <View style={[styles.linkIconContainer, styles.githubBg]}><Ionicons name="logo-github" size={22} color="#FFFFFF" /></View>
          <View style={styles.linkInfo}><Text style={styles.linkLabel}>GitHub</Text><Text style={styles.linkUrl}>github.com/evandojunior</Text></View>
          <Ionicons name="chevron-forward" size={16} color="#444" />
        </Pressable>
      </View>

      <View style={styles.techSection}>
        <Text style={styles.sectionTitle}>Tecnologias</Text>
        <View style={styles.techGrid}>
          {['React Native', 'Expo Router', 'TypeScript', 'Zustand', 'MirageJS', 'Gluestack UI'].map((tech) => (
            <View key={tech} style={styles.techBadge}><Text style={styles.techText}>{tech}</Text></View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão {APP_VERSION}</Text>
        <Text style={styles.footerSubText}>Desafio Técnico — React Native</Text>
      </View>
    </ScrollView>
  );
}
