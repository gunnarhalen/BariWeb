"use client";

import Logo from "@/components/Logo";
import { IconHeart, IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";

export default function PublicFooter() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <Logo width={120} height={30} className="text-white invert" />
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
              Transformando vidas através da tecnologia nutricional. Conectamos pacientes e nutricionistas para uma
              jornada mais saudável.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <IconHeart className="w-5 h-5 text-red-400" />
              <span className="text-sm">Feito com amor no Brasil</span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a href="/pricing" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Planos e Preços
                </a>
              </li>
              <li>
                <a href="/login" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Acesso Nutricionistas
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Baixar App
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors duration-200">
                  Suporte
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-300">
                <IconMail className="w-4 h-4 text-blue-400" />
                <span className="text-sm">contato@bari.com.br</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <IconPhone className="w-4 h-4 text-green-400" />
                <span className="text-sm">(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <IconMapPin className="w-4 h-4 text-red-400" />
                <span className="text-sm">São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-slate-400 text-sm">© 2024 Bari. Todos os direitos reservados.</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                LGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
