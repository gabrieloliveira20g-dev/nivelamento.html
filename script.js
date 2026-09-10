document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastroForm");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        // Captura dos valores do formulário (incluindo o CPF e Redes Sociais)
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const nascimento = document.getElementById("nascimento").value;
        const cpf = document.getElementById("cpf").value;
        const area = document.getElementById("area").value;
        
        const nivelSelecionado = document.querySelector('input[name="nivel"]:checked');
        const nivel = nivelSelecionado ? nivelSelecionado.value : "Não informado";

        const biografia = document.getElementById("biografia").value;
        const aceitaNovidades = document.getElementById("novidades").checked;
        const instagram = document.getElementById("instagram").value;
        const github = document.getElementById("github").value;

        // Objeto com os dados coletados
        const formData = {
            nome,
            email,
            telefone,
            nascimento,
            cpf,
            area,
            nivel,
            biografia,
            aceitaNovidades,
            instagram,
            github
        };

        console.log("Dados do formulário enviados:", formData);
        alert("Cadastro concluído com sucesso!");
    });
});