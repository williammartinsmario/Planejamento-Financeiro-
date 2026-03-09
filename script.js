
function parcelaPRICE(valor,taxa,prazo){

let i = taxa/100/12

return valor*(i*Math.pow(1+i,prazo))/(Math.pow(1+i,prazo)-1)

}

function simular(){

let valor = parseFloat(valorImovel.value)||0
let entrada = parseFloat(entrada.value)||0
let taxa = parseFloat(taxa.value)||0
let prazo = parseInt(prazo.value)||360
let extra = parseFloat(extra.value)||0
let fgts = parseFloat(fgts.value)||0

let financiado = valor - entrada

let parcela = parcelaPRICE(financiado,taxa,prazo)

let saldo = financiado

let i = taxa/100/12

let tabela=[]
let saldoArray=[]

let mes=0

while(saldo>0){

let juros = saldo*i
let amort = parcela - juros + extra

saldo -= amort

if(mes % 24 == 0 && mes>0 && fgts>0){
saldo -= fgts
}

if(saldo<0) saldo=0

mes++

saldoArray.push(saldo)

tabela.push({
mes,
parcela:parcela.toFixed(2),
juros:juros.toFixed(2),
amort:amort.toFixed(2),
saldo:saldo.toFixed(2)
})

if(mes>1000) break

}

let prazoFinal = mes

let anosEconomizados = Math.floor((prazo - prazoFinal)/12)

mostrarTabela(tabela)

graficoSaldo(saldoArray)

graficoPrazo(prazo,prazoFinal)

simularValorizacao()

compararAluguel()

timeline(prazoFinal)

resumo.innerHTML=`

Valor financiado: ${financiado.toFixed(2)}<br>
Parcela estimada: ${parcela.toFixed(2)}<br>
Prazo original: ${prazo} meses<br>
Prazo com estratégia: ${prazoFinal} meses<br><br>

<b>Seu financiamento pode terminar ${anosEconomizados} anos antes usando estratégia financeira.</b>

`
}

function mostrarTabela(tab){

let tbody=document.querySelector("#tabela tbody")
tbody.innerHTML=""

tab.forEach(l=>{

let tr=document.createElement("tr")

tr.innerHTML=`
<td>${l.mes}</td>
<td>${l.parcela}</td>
<td>${l.juros}</td>
<td>${l.amort}</td>
<td>${l.saldo}</td>
`

tbody.appendChild(tr)

})

}

function graficoSaldo(data){

new Chart(graficoSaldo,{
type:"line",
data:{
labels:data.map((_,i)=>i+1),
datasets:[{label:"Saldo Devedor",data:data}]
}
})

}

function graficoPrazo(normal,estrategia){

new Chart(graficoPrazo,{
type:"bar",
data:{
labels:["Normal","Estratégia"],
datasets:[{label:"Meses",data:[normal,estrategia]}]
}
})

}

function simularValorizacao(){

let valor = parseFloat(valorImovel.value)||0
let taxa = parseFloat(valorizacao.value)||0

let futuro = valor*Math.pow((1+taxa/100),5)

resumo.innerHTML += "<br><br>Valor estimado do imóvel em 5 anos: "+futuro.toFixed(2)

}

function compararAluguel(){

let aluguel = parseFloat(aluguel.value)||0
let prazo = parseInt(prazo.value)||360

let totalAluguel = aluguel*prazo

new Chart(graficoAluguel,{
type:"bar",
data:{
labels:["Aluguel pago","Valor financiado"],
datasets:[{data:[totalAluguel,valorImovel.value]}]
}
})

}

function timeline(prazo){

timeline.innerHTML="Linha do tempo:<br>"

for(let i=24;i<prazo;i+=24){
timeline.innerHTML+="Uso FGTS mês "+i+"<br>"
}

timeline.innerHTML+="Financiamento quitado mês "+prazo

}

function baixarPDF(){

html2pdf().from(relatorio).save("planejamento.pdf")

}

function baixarExcel(){

let wb = XLSX.utils.table_to_book(document.getElementById("tabela"),{sheet:"Tabela"})
XLSX.writeFile(wb,"planejamento.xlsx")

}
