# CasaToda Android

Primeiro protótipo da rota prática de controle parental.

## Como funciona

O APK abre o CasaToda hospedado e expõe uma ponte JavaScript chamada `CasaTodaAndroid`. Quando a criança entra no próprio perfil, o site envia ao Android o horário base, minutos perdidos e bônus. O horário final fica salvo no aparelho.

O serviço `CasaToda Proteção` usa o recurso de Acessibilidade do Android para identificar mudanças de aplicativo e mostrar uma tela de bloqueio após o horário final. O bloqueio permanece até 06:00 por enquanto.

## Ativação no celular da criança

1. Instale o APK.
2. Abra CasaToda.
3. Ative `CasaToda Proteção` em Configurações > Acessibilidade.
4. No CasaToda, conecte o aparelho à família e entre no perfil da criança.
5. O horário passa a ser atualizado automaticamente pelo aplicativo.

## Limitações deste modo

Este é o modo prático, não Device Owner. A proteção pode ser desativada manualmente nas configurações do Android ou removendo o aplicativo. O objetivo desta fase é validar o fluxo real de bloqueio antes de avançar para administração total do aparelho.
