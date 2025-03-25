document.getElementById("formFornecedor").addEventListener("submit", function(e) {
    e.preventDefault();

    // Obtendo os dados do formulário
    const nomeVendedor = document.getElementById("nomeVendedor").value.trim();
    const nomeEmpresa = document.getElementById("nomeEmpresa").value.trim();
    const contato = document.getElementById("contatoFornecedor").value.trim();

    // Validação dos dados do formulário
    if (!nomeVendedor || !nomeEmpresa || !contato) {
        alert("Por favor, preencha todos os campos!");
        return; // Interrompe a execução caso algum campo esteja vazio
    }

    // Criando um objeto fornecedor
    const fornecedor = {
        nomeVendedor: nomeVendedor,
        nomeEmpresa: nomeEmpresa,
        contato: contato
    };

    // Enviando o fornecedor para a API via POST
    fetch('http://127.0.0.1:5000/api/fornecedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fornecedor),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);  // Exibe o erro da API, se houver
        }
        return response.json();  // Recebe a resposta da API
    })
    .then(data => {
        console.log("Fornecedor salvo com sucesso:", data);
        alert("Fornecedor cadastrado com sucesso!");

        // Limpar o formulário
        document.getElementById("formFornecedor").reset();
    })
    .catch(error => {
        console.error("Erro ao salvar fornecedor:", error);
        alert("Erro ao salvar fornecedor. " + error.message);  // Mostra o erro detalhado
    });
});