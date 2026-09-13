from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('<meta name="app-version" content="26">','<meta name="app-version" content="27">',1)

css='''
/* Versão 27: navegação geral somente na página inicial */
.topicDone{display:none!important}
.footer{display:none!important}
body.v27InitialPage .footer{display:flex!important}
'''
if 'v27InitialPage' not in s:
    s=s.replace('</style>',css+'</style>',1)

js=r'''
// Versão 27: escolher assunto, ver matérias e zerar lições não aparecem dentro das lições.
function v27SetInitialPage(active){
  document.body.classList.toggle('v27InitialPage',!!active);
}

const v27ShowSubjects=showSubjects;
showSubjects=function(){
  v27ShowSubjects();
  v27SetInitialPage(true);
};

const v27OpenSubject=openSubject;
openSubject=function(subjectKey){
  v27SetInitialPage(false);
  v27OpenSubject(subjectKey);
};

const v27ShowHome=showHome;
showHome=function(){
  v27SetInitialPage(false);
  v27ShowHome();
};

const v27OpenTopic=openTopic;
openTopic=function(topic){
  v27SetInitialPage(false);
  v27OpenTopic(topic);
};
'''

if 'function v27SetInitialPage' not in s:
    marker='showSubjects();\n</script>'
    if marker not in s:
        raise SystemExit('Final do script não encontrado')
    s=s.replace(marker,js+'\nshowSubjects();\n</script>',1)

checks=['app-version" content="27','body.v27InitialPage .footer','function v27SetInitialPage','const v27OpenTopic','const v27ShowSubjects']
for c in checks:
    if c not in s:
        raise SystemExit('Falha '+c)

p.write_text(s,encoding='utf-8')
print('versão 27 aplicada',len(s.encode()))
