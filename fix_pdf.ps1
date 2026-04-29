$p = 'c:\Users\c\Desktop\portfolio\portfolio.basic\src\components\ResumePDF.tsx'
[string]$c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)

$old1 = "interface ResumePDFProps {`r`n  data: ResumeData;`r`n  portfolioData?: Project[];`r`n  heroContent?: any;`r`n  aboutContent?: any;`r`n}"
$new1 = "interface ResumePDFProps {`r`n  data: ResumeData;`r`n  portfolioData?: Project[];`r`n  heroContent?: any;`r`n  aboutContent?: any;`r`n  aiSkills?: any;`r`n  toolCards?: any;`r`n  userImage?: string;`r`n}"
$c = $c.Replace($old1, $new1)

if ($c -match 'aiSkills\?: any;') { Write-Host 'Interface OK' } else { Write-Host 'Interface FAILED - trying LF' 
  $old1b = "interface ResumePDFProps {`n  data: ResumeData;`n  portfolioData?: Project[];`n  heroContent?: any;`n  aboutContent?: any;`n}"
  $new1b = "interface ResumePDFProps {`n  data: ResumeData;`n  portfolioData?: Project[];`n  heroContent?: any;`n  aboutContent?: any;`n  aiSkills?: any;`n  toolCards?: any;`n  userImage?: string;`n}"
  $c = $c.Replace($old1b, $new1b)
  if ($c -match 'aiSkills\?: any;') { Write-Host 'Interface OK (LF)' } else { Write-Host 'Interface still FAILED' }
}

[System.IO.File]::WriteAllText($p, $c, [System.Text.Encoding]::UTF8)
Write-Host 'Done'
