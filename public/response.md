Per creare un **form di login in PHP**, ti servono due parti:

1. Un **form HTML** che raccoglie i dati dell'utente (email o username e password).
2. Uno **script PHP** che gestisce l’autenticazione confrontando i dati con quelli nel database.

Ti faccio un esempio completo passo passo.

---

### 🧾 1. Il form HTML (`login.html`)

```html
<!DOCTYPE html>
<html lang="it">
	<head>
		<meta charset="UTF-8" />
		<title>Login</title>
	</head>
	<body>
		<h2>Login</h2>
		<form action="login.php" method="POST">
			<label for="username">Username:</label>
			<input type="text" name="username" required /><br /><br />

			<label for="password">Password:</label>
			<input type="password" name="password" required /><br /><br />

			<button type="submit">Accedi</button>
		</form>
	</body>
</html>
```

---

### ⚙️ 2. Lo script PHP (`login.php`)

Questo esempio fa il login controllando username e password in un database MySQL.

```php
<?php
// Connessione al database (modifica i parametri con i tuoi)
$host = 'localhost';
$db = 'nome_del_tuo_db';
$user = 'root';
$pass = '';
$conn = new mysqli($host, $user, $pass, $db);

// Controllo connessione
if ($conn->connect_error) {
    die("Connessione fallita: " . $conn->connect_error);
}

// Prendi i dati dal form
$username = $_POST['username'];
$password = $_POST['password'];

// Prevenzione SQL Injection
$username = $conn->real_escape_string($username);
$password = $conn->real_escape_string($password);

// Esegui query per verificare le credenziali
$sql = "SELECT * FROM utenti WHERE username = '$username'";
$result = $conn->query($sql);

if ($result->num_rows == 1) {
    $utente = $result->fetch_assoc();

    // Verifica la password (assumendo che sia stata hashata con password_hash)
    if (password_verify($password, $utente['password'])) {
        session_start();
        $_SESSION['username'] = $username;
        echo "Login riuscito! Benvenuto, " . htmlspecialchars($username) . ".";
    } else {
        echo "Password errata.";
    }
} else {
    echo "Utente non trovato.";
}

$conn->close();
?>
```

---

### 🧠 Importante:

-   Quando registri un utente, **cripta sempre la password** con `password_hash()`:

```php
$password_hash = password_hash($password, PASSWORD_DEFAULT);
```

-   Usa `password_verify()` come nell’esempio sopra per controllare la password.
-   Aggiungi validazioni e protezioni CSRF/sessioni reali in produzione.

---

### ✅ Struttura tabella `utenti` (esempio)

```sql
CREATE TABLE utenti (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

---

Se vuoi, posso aiutarti anche con la **pagina di registrazione**, la gestione delle sessioni o protezione da accessi non autorizzati. Vuoi che ti prepari anche quella parte?
