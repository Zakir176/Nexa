# Fill missing commits between Aug 29 2025 and Sep 13 2025
# This script creates an empty commit for each date in the range that does not already have a commit.
# It sets both author and committer dates to midday of the missing date.

$start = Get-Date "2025-08-29"
$end   = Get-Date "2025-09-13"

# Retrieve existing commit dates in the range (YYYY-MM-DD)
$existing = git log --since='2025-08-29' --until='2025-09-13' --pretty=format:"%ad" --date=short | Sort-Object -Unique

# Generate all dates in the range
$dates = @()
while ($start -le $end) {
    $dates += $start.ToString("yyyy-MM-dd")
    $start = $start.AddDays(1)
}

foreach ($d in $dates) {
    if ($existing -notcontains $d) {
        Write-Host "Creating empty commit for $d"
        $env:GIT_AUTHOR_DATE = "$d 12:00:00"
        $env:GIT_COMMITTER_DATE = "$d 12:00:00"
        git commit --allow-empty -m "Empty commit for $d"
    } else {
        Write-Host "Commit already exists for $d, skipping."
    }
}
