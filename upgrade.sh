#!/data/data/com.termux/files/usr/bin/bash
set -e

cd ~/mohajon-mjh.github.io

mkdir -p backup
cp index.html backup/index.html.$(date +%F-%H%M%S)

cat > login.html <<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Login - Mohajon MJH</title>
<style>
body{font-family:Arial;background:#f5f5f5;display:flex;justify-content:center;align-items:center;height:100vh}
.box{background:#fff;padding:25px;border-radius:12px;max-width:350px;width:100%}
input,button{width:100%;padding:12px;margin:8px 0}
button{background:#0f7a2d;color:#fff;border:0;border-radius:6px}
</style>
</head>
<body>
<div class="box">
<h2>Buyer Login</h2>
<input id="email" type="email" placeholder="Email">
<input id="password" type="password" placeholder="Password">
<button>Login</button>
<p><a href="signup.html">Create Account</a></p>
</div>
</body>
</html>
HTML

cat > signup.html <<'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sign Up - Mohajon MJH</title>
<style>
body{font-family:Arial;background:#f5f5f5;display:flex;justify-content:center;align-items:center;height:100vh}
.box{background:#fff;padding:25px;border-radius:12px;max-width:350px;width:100%}
input,button{width:100%;padding:12px;margin:8px 0}
button{background:#ff9900;border:0;border-radius:6px}
</style>
</head>
<body>
<div class="box">
<h2>Create Account</h2>
<input type="text" placeholder="Full Name">
<input type="email" placeholder="Email">
<input type="password" placeholder="Password">
<button>Create Account</button>
<p><a href="login.html">Already have an account?</a></p>
</div>
</body>
</html>
HTML

~/.auto_push_mjh

echo "Upgrade v4 Complete."
