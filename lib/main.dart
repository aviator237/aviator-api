import 'dart:js' as js;
import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:aviator/Ui/play/Play.dart';
import 'package:aviator/themes/ThemeManager.dart';
import 'package:aviator/themes/themes_custom.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'App/MainPage.dart';
import 'Data/SettingClass/MyUser.dart';
import 'LocalBdManager/LocalBdManager.dart';
import 'Translation/app_localizations.dart';
import 'Translation/setLocale.dart';
import 'Ui/Auth/sign_in_view.dart';
import 'Ui/Common/ConnectivityBanner.dart';
import 'Ui/Game/PlayingPage.dart';
import 'Ui/Public/LandingPage.dart';
import 'Ui/Websocket/socket_service.dart';
import 'services/connectivity_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialiser le service de connectivité
  final connectivityService = ConnectivityService();
  await connectivityService.initialize();

  try {
    await LocalBdManager.initializeBD();

    AdaptiveThemeMode myThemeMode = await ThemeManager.loadSettings();
    // bool hasSeenOnboard =
    //     (await LocalBdManager.localBdSelectSetting("hasSeenOnboard")) == "1";

    bool hasValidToken =
        (await LocalBdManager.localBdSelectSetting("token")) != "none";
    bool hasNestjsAccount =
        (await LocalBdManager.localBdSelectSetting("account")) == "1";
    String locale = await LocalBdManager.localBdSelectSetting("locale");

    if (hasNestjsAccount) {
      SocketService.connectAndListenToSocket();
    }

    if (hasValidToken) {
      try {
        MyUser.getCurrentUser();
        // await MyUser.getCurrentUser();
      } catch (e) {
        if (e.toString().contains("Refresh token failed")) {
          hasValidToken = false;
        }
      }
    }

    runApp(
      MyApp(
        // hasSeenOnboard: hasSeenOnboard,
        hasNestjsAccount: hasNestjsAccount,
        myThemeMode: myThemeMode,
        locale: locale,
        hasValidToken: hasValidToken,
      ),
    );
  } catch (e) {
    // En cas d'erreur d'initialisation, démarrer l'application avec des valeurs par défaut
    print('Erreur lors de l\'initialisation: $e');
    runApp(
      MyApp(
        // hasSeenOnboard: false,
        hasNestjsAccount: false,
        myThemeMode: AdaptiveThemeMode.system,
        locale: 'system',
        hasValidToken: false,
      ),
    );
  }
}

class MyApp extends StatefulWidget {
  const MyApp({
    super.key,
    // required this.hasSeenOnboard,
    required this.hasNestjsAccount,
    required this.myThemeMode,
    required this.locale,
    required this.hasValidToken,
  });
  // final bool hasSeenOnboard;
  final bool hasNestjsAccount;
  final bool hasValidToken;
  final String locale;
  final AdaptiveThemeMode myThemeMode;

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  Widget build(BuildContext context) {
    // Determine the initial locale
    Locale initialLocale;
    if (widget.locale == "system") {
      // Get system locale
      final Locale systemLocale =
          WidgetsBinding.instance.platformDispatcher.locale;
      final String languageCode = systemLocale.languageCode;

      // Check if the language is supported, default to 'en' if not
      final String supportedLanguageCode =
          ['fr', 'en'].contains(languageCode) ? languageCode : 'en';

      initialLocale = Locale(supportedLanguageCode, '');
    } else {
      initialLocale = Locale(widget.locale, '');
    }

    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => LocalProvider(initialLocale)),
      ],
      child: BlocBuilder<LocalProvider, Locale>(
        builder: (context, locale) {
          return AdaptiveTheme(
            light: ThemeCustom.themeDataLight,
            initial: widget.myThemeMode,
            dark: ThemeCustom.themeDataDark,
            builder: (ThemeData light, ThemeData dark) {
              return MaterialApp(
                title: 'Aviator',
                localizationsDelegates: const [
                  AppLocalizationsDelegate(),
                  GlobalMaterialLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                ],
                supportedLocales: const [Locale('fr', ''), Locale('en', '')],
                locale: locale,
                debugShowCheckedModeBanner: false,
                theme: light,
                darkTheme: dark,
                home: ConnectivityBanner(
                  // Afficher la page d'accueil publique pour tous les utilisateurs
                  child: const LandingPage(),
                ),
                routes: {
                  '/game':
                      (context) =>
                          widget.hasNestjsAccount && widget.hasValidToken
                              ? const PlayingPage()
                              : const SignView(),
                  '/login': (context) => const SignView(),
                },
              );
            },
          );
        },
      ),
    );
  }
}
