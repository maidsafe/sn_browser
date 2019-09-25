$url = "https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-gnu/rustup-init.exe"
$installer = $env:TEMP + "\rustup-init.exe"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
(New-Object System.Net.WebClient).DownloadFile($url, $installer)

$installer = $installer.Replace("\", "/")
Try {
  Invoke-Expression "$installer -y --default-host x86_64-pc-windows-msvc" -ErrorVariable error_var 2>$null
} Finally {
  if ($LastExitCode -ne 0) {
    $error_var
    exit $LastExitCode
  }
}
