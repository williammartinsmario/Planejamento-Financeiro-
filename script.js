
const TAXA = 8.5/100/12

function parcelaPRICE(valor,prazo){

return valor*(TAXA*Math.pow(1+TAXA,prazo))/(Math.pow(1+TAXA,prazo)-1)

}

function projetarFGTS(salario,saldo,prazo){

let deposito = salario*0.08
let arr=[]

for(let i=0;i<prazo;i++){
saldo += deposito
arr.push(saldo)
}

return arr

}

function simular(){

let valor = parseFloat(valorImovel.value)||0
let entrada = parseFloat(entrada.value)||0
let prazo = parseInt(prazo.value)||360
let extra = parseFloat(extra.value)||0

let fgtsAtual = parseFloat(fgtsAtual.value)||0
let salario = parseFloat(salario.value)||0
let freq = parseInt(freqFGTS.value)

let financiado = valor - entrada

let parcela = parcelaPRICE(financiado,prazo)

let saldo = financiado

let fgtsProj = projetarFGTS(salario,fgtsAtual,prazo)

let mes=0
let saques=0

let saldoGraf=[]
let tabela=[]

while(saldo>0){

let juros = saldo*TAXA
let amort = parcela - juros + extra

saldo -= amort

if(mes % freq === 0 && mes>0){
saldo -= fgtsProj[mes]||0
saques++
}

if(saldo<0) saldo=0

saldoGraf.push(saldo)

tabela.push({mes:mes+1,saldo:saldo.toFixed(2)})

mes++
if(mes>1000) break

}

let prazoFinal = mes
let anos = Math.floor((prazo-prazoFinal)/12)

resumo.innerHTML=`

Valor financiado: <b>${financiado.toFixed(2)}</b><br>
Parcela estimada: <b>${parcela.toFixed(2)}</b><br>
Prazo original: ${prazo} meses<br>
Prazo com estratégia: ${prazoFinal} meses<br><br>

<b>Seu financiamento pode terminar ${anos} anos antes.</b>

`

fgtsInfo.innerHTML=`

Saques FGTS estimados: ${saques}

`

gerarTabela(tabela)
graficoSaldo(saldoGraf)
graficoPrazo(prazo,prazoFinal)

}

function gerarTabela(tab){

let tbody=document.querySelector("#tabela tbody")
tbody.innerHTML=""

tab.forEach(l=>{

let tr=document.createElement("tr")
tr.innerHTML=`<td>${l.mes}</td><td>${l.saldo}</td>`
tbody.appendChild(tr)

})

}

function graficoSaldo(data){

new Chart(document.getElementById("graficoSaldo"),{
type:"line",
data:{
labels:data.map((_,i)=>i+1),
datasets:[{label:"Saldo Devedor",data:data,borderWidth:2}]
}
})

}

function graficoPrazo(normal,estrategia){

new Chart(document.getElementById("graficoPrazo"),{
type:"bar",
data:{
labels:["Normal","Estratégia"],
datasets:[{label:"Meses",data:[normal,estrategia]}]
}
})

}

function baixarPDF(){

html2pdf().from(document.body).save("planejamento.pdf")

}

function baixarExcel(){

let wb = XLSX.utils.table_to_book(document.getElementById("tabela"),{sheet:"Tabela"})
XLSX.writeFile(wb,"planejamento.xlsx")

}
