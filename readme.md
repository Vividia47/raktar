# Raktárkezelő

Raktárkezelő webalkalmazás készletnyilvántartáshoz és raktári folyamatok kezeléséhez. Szoftverfejlesztő tanfolyam vizsgaremek / csoportos projektmunka.

## Technológiai stack

**Adatbázis:** MySQL

**Backend:** ASP.NET Core Web API (C#), JWT Bearer hitelesítés

**Frontend:** HTML5, CSS3, JavaScript, Bootstrap

## Előfeltételek

* .NET SDK
* Futó MySQL-kiszolgáló (XAMPP/WAMP is használható)
* Modern webböngésző

A backend adatbázis-kapcsolata a konfigurációs fájlban módosítható.

## Adatbázis

A projekthez tartozó adatbázis-dump a repositoryban található.

Az adatbázis használatához:

1. Indítsa el a MySQL-kiszolgálót, például WAMP használata esetén a WAMP-ból.
2. Nyissa meg a phpMyAdmin felületét.
3. Hozza létre a projekt által használt adatbázist.
4. A repositoryban található `create.sql` adatbázis-dump importálásával hozza létre az adatbázis tábláit.
5. Ellenőrizze a backend konfigurációs fájljában az adatbázis-kapcsolat adatait, és szükség esetén módosítsa azokat a saját MySQL-környezetedhez.

Az adatbázis **szándékosan nem tartalmaz előre feltöltött felhasználókat vagy termékeket**.

Az alkalmazás első indításakor, amennyiben még nincs felhasználó az adatbázisban, a kezdőoldalon létrehozható az első felhasználói fiók.

## Indítás

### 1. MySQL elindítása

Indítsa el a MySQL-kiszolgálót WAMP, XAMPP vagy más MySQL-környezet segítségével.

### 2. Adatbázis beállítása

A fent leírt módon importálja az adatbázis-dumpot phpMyAdmin segítségével, majd ellenőrizze a backend adatbázis-kapcsolatát.

### 3. Backend indítása

A projekt főkönyvtárából:

```bash
cd Backend\WarehouseAPI\WarehouseAPI
dotnet run
```

A backend indítása után az alkalmazás a terminálban megjelenő címen érhető el.

A frontend a backend API-ján keresztül kommunikál a szerverrel.

## Belépés és felhasználók

Ha az adatbázis még nem tartalmaz felhasználót, az alkalmazás lehetőséget biztosít az első felhasználó létrehozására.

A későbbi felhasználók létrehozását és kezelését a megfelelő jogosultsággal rendelkező felhasználó végezheti.

A bejelentkezés JWT alapú hitelesítést használ.

## Jogosultsági körök

Az alkalmazás négy felhasználói szerepkört kezel:

* **Raktárvezető** – teljes hozzáférés az alkalmazáshoz, beleértve a felhasználók kezelését.
* **Raktáros** – termékek kezelése és raktári készletmozgások rögzítése.
* **Kereskedő** – termékek és készletmennyiségek megtekintése, valamint az árak módosítása.
* **Anyagbeszerző** – készletmennyiségek megtekintése és a minimum készletszint alapján utánrendelést igénylő termékek ellenőrzése.

## Főbb funkciók

* Felhasználói bejelentkezés és JWT alapú hitelesítés
* Szerepkör alapú jogosultságkezelés
* Termékek és készletek kezelése
* Bevételezés és kiadás rögzítése
* Készletmozgások nyilvántartása
* Eladási és beszerzési árak kezelése
* Minimum készletszint figyelése
* Raktári előzmények megtekintése
* Reszponzív, Bootstrap alapú felhasználói felület

## Adatbázis főbb táblái

* **goods** – termékek adatai
* **users** – felhasználók és jogosultságok
* **history** – raktári készletmozgások és tranzakciók

## API

A backend REST API-n keresztül biztosítja többek között:

* felhasználói hitelesítés
* felhasználók kezelése
* termékek kezelése
* raktárkészlet kezelése
* készletmozgások rögzítése
* előzmények lekérdezése

## Hasznos fejlesztői eszközök

* Visual Studio / Visual Studio Code
* MySQL
* phpMyAdmin
* WAMP
* Postman
* Git / GitHub

## Készítők

**Dobrocsi Zsolt**

Backend és adatbázis fejlesztés.

**Tempfli Vivien**

Frontend fejlesztés, felhasználói felület, hitelesítés.

## Megjegyzések

A projekt oktatási célból, csoportos vizsgaremekként készült.

Az alkalmazás üres adatbázissal is elindítható. Az első felhasználó létrehozása után a rendszer a felhasználó szerepkörének megfelelő funkciókat biztosít.