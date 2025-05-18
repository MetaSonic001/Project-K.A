import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  gradient?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  gradient = false,
  ...rest
}: ButtonProps) {
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    let buttonStyle: StyleProp<ViewStyle> = [styles.button];

    // Add size style
    switch (size) {
      case 'sm':
        buttonStyle = [...buttonStyle, styles.buttonSm];
        break;
      case 'lg':
        buttonStyle = [...buttonStyle, styles.buttonLg];
        break;
      default:
        buttonStyle = [...buttonStyle, styles.buttonMd];
    }

    // Add variant style
    if (!gradient) {
      switch (variant) {
        case 'secondary':
          buttonStyle = [...buttonStyle, styles.buttonSecondary];
          break;
        case 'outline':
          buttonStyle = [...buttonStyle, styles.buttonOutline];
          break;
        case 'ghost':
          buttonStyle = [...buttonStyle, styles.buttonGhost];
          break;
        case 'danger':
          buttonStyle = [...buttonStyle, styles.buttonDanger];
          break;
        default:
          buttonStyle = [...buttonStyle, styles.buttonPrimary];
      }
    }

    // Add disabled style
    if (disabled || loading) {
      buttonStyle = [...buttonStyle, styles.buttonDisabled];
    }

    return [buttonStyle, style];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    let buttonTextStyle: StyleProp<TextStyle> = [styles.buttonText];

    // Add size style
    switch (size) {
      case 'sm':
        buttonTextStyle = [...buttonTextStyle, styles.buttonTextSm];
        break;
      case 'lg':
        buttonTextStyle = [...buttonTextStyle, styles.buttonTextLg];
        break;
      default:
        buttonTextStyle = [...buttonTextStyle, styles.buttonTextMd];
    }

    // Add variant style
    switch (variant) {
      case 'outline':
        buttonTextStyle = [...buttonTextStyle, styles.buttonTextOutline];
        break;
      case 'ghost':
        buttonTextStyle = [...buttonTextStyle, styles.buttonTextGhost];
        break;
      case 'danger':
        buttonTextStyle = [...buttonTextStyle, styles.buttonTextDanger];
        break;
      default:
        buttonTextStyle = [...buttonTextStyle, styles.buttonTextPrimary];
    }

    // Add disabled style
    if (disabled || loading) {
      buttonTextStyle = [...buttonTextStyle, styles.buttonTextDisabled];
    }

    return [buttonTextStyle, textStyle];
  };

  const renderButton = () => (
    <>
      {loading && (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? '#3B82F6' : '#FFFFFF'} 
          style={styles.buttonLoader} 
        />
      )}
      {!loading && leftIcon && <>{leftIcon}</>}
      <Text style={getTextStyle()}>{title}</Text>
      {!loading && rightIcon && <>{rightIcon}</>}
    </>
  );

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {gradient ? (
        <LinearGradient
          colors={['#6366F1', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientContainer}
        >
          {renderButton()}
        </LinearGradient>
      ) : (
        renderButton()
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonPrimary: {
    backgroundColor: '#3B82F6',
  },
  buttonSecondary: {
    backgroundColor: '#CBD5E1',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDanger: {
    backgroundColor: '#EF4444',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonSm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonMd: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonLg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextOutline: {
    color: '#3B82F6',
  },
  buttonTextGhost: {
    color: '#3B82F6',
  },
  buttonTextDanger: {
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: '#94A3B8',
  },
  buttonTextSm: {
    fontSize: 14,
  },
  buttonTextMd: {
    fontSize: 16,
  },
  buttonTextLg: {
    fontSize: 18,
  },
  buttonLoader: {
    marginRight: 8,
  },
  gradientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
  },
});