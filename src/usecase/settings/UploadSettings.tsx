import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity
} from 'react-native';
import UndoTextInput from '../buffers/ui/UndoTextInput';
import { styles } from './SettingsNavigator';
import { ConnectedProps, connect } from 'react-redux';
import { StoreState } from '../../store';

const connector = connect((state: StoreState) => ({
  uploadOptions: state.connection.mediaUploadOptions
}));

type Props = {
  setShowUploadSettings: (show: boolean) => void;
} & ConnectedProps<typeof connector>;

const UploadSettings: React.FC<Props> = ({
  uploadOptions,
  dispatch,
  setShowUploadSettings
}) => {
  const [uploadOptionsState, setUploadOptionsState] = useState(uploadOptions);

  const updateUploadOptionsState = <T,>(
    attribute: string,
    value: T,
    forceUndefined: boolean
  ) => {
    setUploadOptionsState({
      ...uploadOptionsState,
      [attribute]: forceUndefined ? value || undefined : value
    });
  };

  const setUploadOptionsUrl = (url: string) => {
    updateUploadOptionsState('url', url, false)
  };

  const setUploadOptionsBasicAuth = (basicAuth: boolean) => {
    updateUploadOptionsState('basicAuth', basicAuth, false)
  };

  const setUploadOptionsUsername = (username: string) => {
    updateUploadOptionsState('username', username, true)
  };

  const setUploadOptionsPassword = (password: string) => {
    updateUploadOptionsState('password', password, true);
  };

  const setUploadOptionsFieldName = (fieldName: string) => {
    updateUploadOptionsState('fieldName', fieldName, true);
  };

  const setUploadOptions = () => {
    dispatch({
      type: 'SET_MEDIA_UPLOAD_OPTIONS',
      payload: uploadOptionsState
    });
    setShowUploadSettings(false);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.header}>Media Upload Settings</Text>

        <UndoTextInput
          style={styles.input}
          placeholderTextColor="#4157af"
          keyboardType="url"
          autoCapitalize="none"
          placeholder="Upload Service URL"
          onChangeText={setUploadOptionsUrl}
          value={uploadOptionsState.url}
          autoCorrect={false}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.text}>Use Basic Auth</Text>
          <Switch
            style={{ margin: 10 }}
            onValueChange={setUploadOptionsBasicAuth}
            value={uploadOptionsState.basicAuth}
          />
        </View>
        {uploadOptionsState.basicAuth && (
          <>
            <UndoTextInput
              style={styles.input}
              placeholderTextColor="#4157af"
              keyboardType="url"
              autoCapitalize="none"
              placeholder="Upload Service Username"
              onChangeText={setUploadOptionsUsername}
              value={uploadOptionsState.username}
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#4157af"
              autoCapitalize="none"
              placeholder="Upload Service Password"
              secureTextEntry
              onChangeText={setUploadOptionsPassword}
              value={uploadOptionsState.password}
            />
          </>
        )}
        <UndoTextInput
          style={styles.input}
          placeholderTextColor="#4157af"
          autoCapitalize="none"
          placeholder="Form Field Name (default: file)"
          autoCorrect={false}
          onChangeText={setUploadOptionsFieldName}
          value={uploadOptionsState.fieldName}
        />
        <View style={styles.centeredButton}>
          <TouchableOpacity style={styles.button} onPress={setUploadOptions}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connector(UploadSettings);
