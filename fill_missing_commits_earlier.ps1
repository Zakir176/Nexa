# Fill missing commits from 2025-06-22 to 2025-08-27
# This PowerShell script creates an empty commit for each day in the range
# that does not already have a commit. It sets the author and committer dates
# to midday (12:00:00) of the respective day.

$start = Get-Date "2025-06-22"
$end   = Get-Date "2025-08-27"

# Get existing commit dates in the range (YYYY-MM-DD)
$existing = git log --since='2025-06-22' --until='2025-08-27' --pretty=format:"%ad" --date=short | Sort-Object -Unique

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
