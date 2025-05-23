import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Award, Users, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-800 to-primary-700 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Descubra a Próxima Obra-Prima Literária
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8 animate-slide-up">
              Participe do nosso concurso exclusivo de escrita e mostre seu talento ao mundo.
              Seja reconhecido por especialistas do setor e ganhe prêmios incríveis.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up">
              <Button 
                size="lg" 
                variant="accent" 
                onClick={() => navigate('/register')}
              >
                Envie Sua Inscrição
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-primary-600"
                onClick={() => navigate('/voting')}
              >
                Vote nos Finalistas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona o Concurso</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nosso concurso segue um processo de seleção em três etapas para garantir que os melhores trabalhos sejam reconhecidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <PenTool size={24} className="text-primary-700" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Etapa 1: Submissão</h3>
              <p className="text-gray-600">
                Envie seu vídeo e sinopse. Nossos jurados selecionarão 10 inscrições por gênero para avançar à próxima fase.
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center">
                  <Award size={24} className="text-secondary-700" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Etapa 2: Manuscrito</h3>
              <p className="text-gray-600">
                Participantes selecionados enviam seu manuscrito completo. Jurados avaliam e selecionam 2 finalistas por gênero.
              </p>
            </Card>

            <Card className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center">
                  <Star size={24} className="text-accent-700" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Etapa 3: Votação Pública</h3>
              <p className="text-gray-600">
                O público vota em seu finalista favorito em cada gênero. Um vencedor por gênero é selecionado.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gêneros do Concurso</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos procurando manuscritos excepcionais nos seguintes gêneros:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Ficção</h3>
              <p className="text-gray-600">
                Romances, contos e ficção literária que demonstrem narrativa criativa e desenvolvimento de personagens.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Não-Ficção</h3>
              <p className="text-gray-600">
                Memórias, biografias e obras informativas que proporcionem insights e expandam o conhecimento.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-primary-800 mb-3">Poesia</h3>
              <p className="text-gray-600">
                Coleções de poemas que expressam emoções, experiências e observações através de linguagem artística.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Judges Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Conheça Nossos Jurados Especialistas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nosso concurso é avaliado por especialistas literários renomados que trazem anos de experiência no setor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Users size={48} className="text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                <p className="text-gray-500 mb-3">Jurada de Ficção</p>
                <p className="text-gray-600">
                  Romancista premiada com mais de 15 anos de experiência no setor editorial.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Users size={48} className="text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
                <p className="text-gray-500 mb-3">Jurado de Não-Ficção</p>
                <p className="text-gray-600">
                  Autor best-seller e editor com expertise em biografias e relatos históricos.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Users size={48} className="text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Elena Rodriguez</h3>
                <p className="text-gray-500 mb-3">Jurada de Poesia</p>
                <p className="text-gray-600">
                  Poetisa publicada e professora de escrita criativa em uma universidade prestigiada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-700 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Pronto para Mostrar Seu Talento?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Participe do nosso concurso hoje e dê o primeiro passo rumo ao reconhecimento literário.
          </p>
          <Button 
            size="lg" 
            variant="accent"
            onClick={() => navigate('/register')}
          >
            Envie Sua Inscrição Agora
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;