import pandas as pd

df = pd.read_csv('ipc_sections.csv', encoding='latin1')

# Shift title column up by 1 to align with correct section
df['title'] = df['title'].shift(-1)

# Drop last row which becomes NaN
df = df.dropna(subset=['title'])

# Save corrected CSV
df.to_csv('ipc_sections_fixed.csv', index=False)
print("Fixed CSV saved!")
print(df[df['section']=='IPC_378'][['section','title']].to_string())