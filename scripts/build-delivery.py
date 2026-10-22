import sys,re,html
from pathlib import Path
sys.path.insert(0,str(Path('.packages').resolve()))
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
import pymupdf

styles=getSampleStyleSheet()
styles['BodyText'].fontSize=8.5;styles['BodyText'].leading=12;styles['BodyText'].spaceAfter=6
styles['Heading1'].fontSize=23;styles['Heading1'].leading=28;styles['Heading1'].textColor=colors.HexColor('#173d38')
styles['Heading2'].fontSize=14;styles['Heading2'].leading=18;styles['Heading2'].spaceBefore=13
styles.add(ParagraphStyle(name='Cell',fontName='Helvetica',fontSize=7.5,leading=10))
def markup(s):
 s=html.escape(s.replace('–','-').replace('—','-').replace('≤','&lt;='))
 s=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',s)
 s=re.sub(r'`([^`]+)`',r'<font name="Courier">\1</font>',s)
 return re.sub(r'\[([^]]+)\]\([^)]+\)',r'\1',s)
story=[]
for file in ['docs/requisitos-seguridad.md','docs/pruebas.md','docs/registro-grupo.md']:
 if story:story.append(PageBreak())
 lines=Path(file).read_text(encoding='utf8').splitlines();i=0
 while i<len(lines):
  line=lines[i]
  if line.startswith('|'):
   rows=[]
   while i<len(lines) and lines[i].startswith('|'):
    cells=[x.strip() for x in lines[i].strip('|').split('|')]
    if not all(re.fullmatch(r'[:\- ]+',x) for x in cells):rows.append([Paragraph(markup(x),styles['Cell']) for x in cells])
    i+=1
   widths=[45,65,150,243] if len(rows[0])==4 else [503/len(rows[0])]*len(rows[0])
   if file.endswith('pruebas.md') and len(rows[0])==4:
    widths=[100,55,175,173] if 'Prueba' in lines[i-len(rows)-1] else [125,125,125,128]
   table=Table(rows,colWidths=widths,repeatRows=1,hAlign='LEFT')
   table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e9efdf')),('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),.3,colors.HexColor('#cdd7cb')),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]));story.append(KeepTogether([table]) if file.endswith('pruebas.md') else table);story.append(Spacer(1,10));continue
  if line.strip():
   if line.startswith('# '):style='Heading1';line=line[2:]
   elif line.startswith('## '):style='Heading2';line=line[3:]
   else:style='BodyText'
   story.append(Paragraph(markup(line),styles[style]))
  i+=1
def footer(c,d):
 c.setFont('Helvetica',8);c.setFillColor(colors.HexColor('#64716b'));c.drawString(46,29,'LABORATORIO 2 / PARTES 1 Y 2 / 22 OCT 2026');c.drawRightString(549,29,str(d.page))
out=Path('output/pdf/Entrega_Laboratorio_2.pdf');out.parent.mkdir(parents=True,exist_ok=True)
SimpleDocTemplate(str(out),pagesize=(595.28,841.89),leftMargin=46,rightMargin=46,topMargin=45,bottomMargin=55,title='Entrega Laboratorio 2 - Seguridad, pruebas y registro del grupo',author='Alex Serrano, Alba Prats y Tomás Juan').build(story,onFirstPage=footer,onLaterPages=footer)
doc=pymupdf.open(out)
Path('tmp/pdfs').mkdir(parents=True,exist_ok=True)
for i,p in enumerate(doc):p.get_pixmap(matrix=pymupdf.Matrix(1.3,1.3)).save(f'tmp/pdfs/delivery-{i+1}.png')
print('PDF generado y renderizado:',len(doc),'páginas')
