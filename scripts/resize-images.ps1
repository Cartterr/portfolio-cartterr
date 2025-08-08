Param()
$ErrorActionPreference = 'Stop'
$root = Join-Path (Get-Location) 'portfolio'
$dest = Join-Path $root 'smaller'
New-Item -ItemType Directory -Path $dest -Force | Out-Null
$names = @(
  'geoscience (3).png','nd2.png','profile1.jpg','nd4.JPG','geoscience (2).png','nd1.jpg','nd6.jpg','nd5.jpg',
  'ayudante (2).jpg','profile8.jpg','profile6.jpg','profile7.jpg','ayudante (4).jpg','ayudante (3).jpg',
  'ayudante (5).jpg','ayudante (1).jpg','profile9'
)
Add-Type -AssemblyName System.Drawing
foreach ($n in $names) {
  $exact = Join-Path $root $n
  $src = $null
  if (Test-Path -LiteralPath $exact) {
    $src = Get-Item -LiteralPath $exact
  } else {
    $base = [System.IO.Path]::GetFileNameWithoutExtension($n)
    $src = Get-ChildItem -Path $root -File | Where-Object { $_.BaseName -eq $base } | Select-Object -First 1
  }
  if (-not $src) { Write-Host "Missing: $n"; continue }

  $img = [System.Drawing.Image]::FromFile($src.FullName)
  try {
    if ($img.PropertyIdList -contains 274) {
      $o = $img.GetPropertyItem(274).Value[0]
      switch ($o) {
        2 { $img.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
        3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        4 { $img.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipY) }
        5 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
        6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        7 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
        8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
      try { $img.RemovePropertyItem(274) } catch {}
    }

    $w = $img.Width; $h = $img.Height
    $scaled = $img
    if ($w -gt 1280) {
      $nh = [int]([math]::Round($h * 1280.0 / $w))
      $bmp = New-Object System.Drawing.Bitmap 1280, $nh
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.DrawImage($img, 0, 0, 1280, $nh)
      $g.Dispose()
      $scaled = $bmp
    }

    $out = Join-Path $dest $src.Name
    $ext = $src.Extension.ToLowerInvariant()
    if ($ext -in @('.jpg','.jpeg','.jfif','.jpe','.jpg_large','.JPG','.JPEG')) {
      $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
      $p = New-Object System.Drawing.Imaging.EncoderParameters 1
      $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 85L
      $scaled.Save($out, $enc, $p)
    }
    elseif ($ext -eq '.png' -or $ext -eq '.PNG') {
      $scaled.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    else {
      $scaled.Save($out)
    }

    if ($scaled -ne $img) { $scaled.Dispose() }
    $img.Dispose()
    Write-Host "Saved: $($src.Name)"
  } catch {
    try { $img.Dispose() } catch {}
    Write-Host "Failed: $($src.Name) - $($_.Exception.Message)"
  }
}
Write-Host "Done. Output: $dest"
