// react-native-countdown-fixed.d.ts

declare module 'react-native-countdown-fixed' {
    import * as React from 'react';
    import { ViewStyle, TextStyle } from 'react-native';
  
    interface CountdownProps {
      until: number; // Time in seconds for the countdown
      size?: number; // Font size for the digits
      onFinish?: () => void; // Function to call when the countdown finishes
      digitStyle?: ViewStyle; // Style for the digit container
      digitTxtStyle?: TextStyle; // Style for the digit text
      timeLabelStyle?: TextStyle; // Style for the time labels
      separatorStyle?: TextStyle; // Style for the separator
      timeToShow?: Array<'D' | 'H' | 'M' | 'S'>; // Array of time units to show
      timeLabels?: { [key: string]: string }; // Custom labels for the time units
      showSeparator?: boolean; // Whether to show the separator
      running?:boolean
    }
  
    export default class Countdown extends React.Component<CountdownProps> {}
  }
  