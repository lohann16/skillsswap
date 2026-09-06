
import React, { useState, useEffect } from 'react';

import {View,Text,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,ScrollView,StyleSheet,ActivityIndicator,Alert,Image,} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { ref, get, update, set } from 'firebase/database';
import {ref as storageRef,uploadBytes,getDownloadURL,deleteObject,} from 'firebase/storage';

import * as ImagePicker from 'expo-image-picker';

import { auth, db, storage } from '../firebase/config';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const initial = route.params?.profile;

  const currentUid = auth.currentUser?.uid;

  const [name, setName] = useState(initial?.name || '');

  const [location, setLocation] = useState(
    initial?.location && initial.location !== 'Not set yet'
      ? initial.location
      : ''
  );

  const [availability, setAvailability] = useState(
    initial?.availability && initial.availability !== 'Not set yet'
      ? initial.availability
      : ''
  );

  const [skillToTeach, setSkillToTeach] = useState(
    initial?.skillsToTeach?.[0] || ''
  );

  const [skillToLearn, setSkillToLearn] = useState(
    initial?.skillsToLearn?.[0] || ''
  );

  const [profileImage, setProfileImage] = useState(
    initial?.profileImage || initial?.photoURL || null
  );

  const [originalProfileImage, setOriginalProfileImage] = useState(
    initial?.profileImage || initial?.photoURL || null
  );

  const [loading, setLoading] = useState(!initial);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!currentUid) return;

    const loadData = async () => {
      try {
        const [userSnap, teachSnap, learnSnap] = await Promise.all([
          get(ref(db, `users/${currentUid}`)),
          get(ref(db, `user_skills_teach/${currentUid}`)),
          get(ref(db, `user_skills_learn/${currentUid}`)),
        ]);

        const userData = userSnap.val() || {};
        const teachData = teachSnap.val();
        const learnData = learnSnap.val();

        if (!initial) {
          setName(
            userData.name ||
              auth.currentUser?.displayName ||
              ''
          );

          setLocation(userData.location || '');
          setAvailability(userData.availability || '');

          setSkillToTeach(teachData?.skill || '');
          setSkillToLearn(learnData?.skill || '');

          setProfileImage(
            userData.profileImage ||
              userData.photoURL ||
              auth.currentUser?.photoURL ||
              null
          );

          setOriginalProfileImage(
            userData.profileImage ||
              userData.photoURL ||
              auth.currentUser?.photoURL ||
              null
          );
        }
      } catch (err) {
        console.error(err);

        Alert.alert(
          'Error',
          'Could not load your profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUid]);

  // =====================================================
  // PICK PROFILE IMAGE
  // =====================================================

  const pickProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Please allow photo library access to choose a profile picture.'
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (result.canceled) return;

      const selectedImage = result.assets?.[0]?.uri;

      if (!selectedImage) return;

      setProfileImage(selectedImage);
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Image error',
        'Could not select the profile picture.'
      );
    }
  };

  // =====================================================
  // UPLOAD IMAGE TO FIREBASE STORAGE
  // =====================================================

  const uploadProfileImage = async (imageUri) => {
    if (!currentUid || !imageUri) return null;

    // If the image is already a Firebase URL,
    // there is nothing to upload.
    if (imageUri.startsWith('https://')) {
      return imageUri;
    }

    try {
      setUploadingImage(true);

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const imageRef = storageRef(
        storage,
        `profile_images/${currentUid}/profile.jpg`
      );

      await uploadBytes(imageRef, blob, {
        contentType: 'image/jpeg',
      });

      const downloadURL = await getDownloadURL(imageRef);

      return downloadURL;
    } catch (error) {
      console.error('Profile image upload error:', error);

      Alert.alert(
        'Upload failed',
        'Could not upload your profile picture. Please try again.'
      );

      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // =====================================================
  // REMOVE PROFILE IMAGE
  // =====================================================

  const removeProfileImage = () => {
    Alert.alert(
      'Remove profile picture',
      'Are you sure you want to remove your profile picture?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setProfileImage(null);
          },
        },
      ]
    );
  };

  // =====================================================
  // PROFILE IMAGE MENU
  // =====================================================

  const handleProfileImagePress = () => {
    if (profileImage) {
      Alert.alert(
        'Profile picture',
        'What would you like to do?',
        [
          {
            text: 'Change photo',
            onPress: pickProfileImage,
          },
          {
            text: 'Remove photo',
            style: 'destructive',
            onPress: removeProfileImage,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      pickProfileImage();
    }
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(
        'Missing name',
        'Please enter your name.'
      );
      return;
    }

    if (!currentUid) {
      Alert.alert(
        'Not signed in',
        'Please log in again and retry.'
      );
      return;
    }

    setSaving(true);

    try {
      let finalProfileImage = profileImage;

      // Upload new image if necessary
      if (
        profileImage &&
        !profileImage.startsWith('https://')
      ) {
        finalProfileImage =
          await uploadProfileImage(profileImage);

        if (!finalProfileImage) {
          setSaving(false);
          return;
        }
      }

      // Update user profile
      await update(
        ref(db, `users/${currentUid}`),
        {
          name: name.trim(),
          location: location.trim(),
          availability: availability.trim(),
          profileImage: finalProfileImage || null,
        }
      );

      // Single-skill model for now
      await set(
        ref(db, `user_skills_teach/${currentUid}`),
        skillToTeach.trim()
          ? {
              skill: skillToTeach.trim(),
            }
          : null
      );

      await set(
        ref(db, `user_skills_learn/${currentUid}`),
        skillToLearn.trim()
          ? {
              skill: skillToLearn.trim(),
            }
          : null
      );

      navigation.goBack();
    } catch (err) {
      console.error(err);

      Alert.alert(
        'Save failed',
        'Something went wrong. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View
        style={[
          styles.screen,
          styles.centered,
        ]}
      >
        <ActivityIndicator
          color="#4F46E5"
          size="large"
        />
      </View>
    );
  }

  // =====================================================
  // MAIN SCREEN
  // =====================================================

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#172554"
          />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>
          Edit Profile
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================
            PROFILE PICTURE
        ===================================================== */}

        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profilePictureWrapper}
            onPress={handleProfileImagePress}
            activeOpacity={0.85}
            disabled={uploadingImage}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profilePicture}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitial}>
                  {name
                    ? name
                        .trim()
                        .charAt(0)
                        .toUpperCase()
                    : '?'}
                </Text>
              </View>
            )}

            <View style={styles.cameraButton}>
              {uploadingImage ? (
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />
              ) : (
                <Ionicons
                  name="camera"
                  size={18}
                  color="#FFFFFF"
                />
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.changePhotoText}>
            {profileImage
              ? 'Tap to change profile picture'
              : 'Add a profile picture'}
          </Text>
        </View>

        {/* =====================================================
            BASIC INFO
        ===================================================== */}

        <Text style={styles.sectionTitle}>
          Basic info
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Full name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Location
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Johannesburg, ZA"
            placeholderTextColor="#94A3B8"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Availability
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Weekday evenings"
            placeholderTextColor="#94A3B8"
            value={availability}
            onChangeText={setAvailability}
            autoCapitalize="sentences"
          />
        </View>

        {/* =====================================================
            SKILLS
        ===================================================== */}

        <Text style={styles.sectionTitle}>
          Skills
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>
            Skill you can teach
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Photography"
            placeholderTextColor="#94A3B8"
            value={skillToTeach}
            onChangeText={setSkillToTeach}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Skill you want to learn
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Spanish"
            placeholderTextColor="#94A3B8"
            value={skillToLearn}
            onChangeText={setSkillToLearn}
            autoCapitalize="words"
          />
        </View>

        {/* =====================================================
            SAVE BUTTON
        ===================================================== */}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            saving &&
              styles.primaryButtonDisabled,
          ]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving || uploadingImage}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={styles.primaryButtonText}
            >
              Save changes
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },

  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // =====================================================
  // HEADER
  // =====================================================

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === 'ios' ? 8 : 20,
    paddingBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#172554',
  },

  headerSpacer: {
    width: 40,
  },

  // =====================================================
  // PROFILE PICTURE
  // =====================================================

  profileSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },

  profilePictureWrapper: {
    width: 112,
    height: 112,
    position: 'relative',
  },

  profilePicture: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#E0E7FF',
  },

  profilePlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
  },

  profileInitial: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#F5F7FF',
  },

  changePhotoText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
  },

  // =====================================================
  // FORM
  // =====================================================

  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#172554',
    marginTop: 16,
    marginBottom: 12,
  },

  field: {
    width: '100%',
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#172554',
    shadowColor: '#312E81',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },

  // =====================================================
  // SAVE BUTTON
  // =====================================================

  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  primaryButtonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomSpace: {
    height: 20,
  },
});

