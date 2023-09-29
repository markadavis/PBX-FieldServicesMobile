import { SplashScreen } from '@capacitor/splash-screen';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Browser } from '@capacitor/browser';

window.Capacitor = {
  SplashScreen: SplashScreen,
  Browser: Browser,
  Device: Device,
  Geolocation: Geolocation,
  Camera: Camera
};
