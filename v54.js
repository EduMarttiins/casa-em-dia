/* Lousa de Estudos — versão 54: respostas abertas de Português com 8 linhas maiores */
(() => {
  if (window.__lousaV54PortugueseBoard) return;
  window.__lousaV54PortugueseBoard = true;

  const STYLE_ID = 'lousaV54PortugueseBoardStyles';

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Oito espaços de escrita de 46 px, como um caderno escolar mais confortável. */
      .calligraphyBoard .canvasWrap{
        height:368px!important;
      }
      .calligraphyBoard .answerCanvas{
        background-color:#fffdf8!important;
        background-image:repeating-linear-gradient(
          to bottom,
          #fffdf8 0,
          #fffdf8 45px,
          rgba(73,126,180,.48) 45px,
          rgba(73,126,180,.48) 46px
        )!important;
        background-size:auto 46px!important;
      }
      @media(max-width:720px){
        .calligraphyBoard .canvasWrap{height:368px!important}
      }
    `;
    document.head.appendChild(style);
  }

  if (document.head) installStyles();
  else document.addEventListener('DOMContentLoaded', installStyles, {once:true});
})();
