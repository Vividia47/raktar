[Magyar](README.md) | [English](README.en.md)

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

1. Nyissa meg a phpMyAdmin felületét.
2. Importálja a repositoryban található `create.sql` adatbázis-dumpot.
3. A dump automatikusan létrehozza a `warehouse` nevű adatbázist és a szükséges táblákat.
4. Ellenőrizze a backend konfigurációs fájljában az adatbázis-kapcsolat adatait, és szükség esetén módosítsa azokat a saját MySQL-környezetéhez.

Az adatbázis szándékosan nem tartalmaz előre feltöltött felhasználókat vagy termékeket.

Ha az adatbázis még nem tartalmaz felhasználót, az első felhasználói fiók a kezdőoldalon hozható létre.

## Indítás

### 1. MySQL elindítása

Indítsa el a MySQL-kiszolgálót WAMP, XAMPP vagy más MySQL-környezet segítségével.

### 2. Backend indítása

A projekt főkönyvtárából:

```bash
cd Backend\WarehouseAPI\WarehouseAPI

dotnet run
```

A backend indítása után az API a terminálban megjelenő címen érhető el.

### 3. Frontend indítása

1. Nyissa meg a projekt `Frontend` mappáját Visual Studio Code-ban.
2. Indítsa el az `index.html` fájlt **Live Server** segítségével.

A Live Server alapértelmezett címe:

```text
http://localhost:5500/Frontend/index.html
```

Ha a Live Server a `127.0.0.1` címet használja, az is megfelelő.

A frontend a backend API-ján keresztül kommunikál a szerverrel.

## Belépés és felhasználók

A rendszer JWT alapú hitelesítést használ.

Ha az adatbázis még nem tartalmaz felhasználót, az első felhasználói fiók a kezdőoldalon hozható létre.

A későbbi felhasználók létrehozását és kezelését a megfelelő jogosultsággal rendelkező felhasználó végezheti.

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

A hitelesítést igénylő végpontok JWT Bearer tokent használnak.

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

A fejlesztői JWT-kulcs a Development konfigurációban található, ezért a projekt egy friss repository-klónból külön titokbeállítás nélkül is elindítható.