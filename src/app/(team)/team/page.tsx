"use client";

import { Button } from "@/components/ui/button";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import ImageSelector from "@/components/image-selector"; // Importa el nuevo componente

export default function TeamCreationPage() {
  const [teamName, setTeamName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { teamName, schoolName, selectedImage });
    // Reset form after submission
    setTeamName('');
    setSchoolName('');
    setSelectedImage(null);
  };

  return (
    <main className="w-screen flex justify-center items-center h-dvh overflow-y-auto">
      <section className="w-full px-20 lg:w-auto lg:mx-auto flex flex-col gap-8">
        <header className="flex flex-col items-center lg:items-start w-full justify-center relative">
          <h2 className="text-4xl text-purple-500 font-medium text-start">
            Registro de Equipo Nuevo
          </h2>
        </header>
        <form onSubmit={handleSubmit} className="gap-4 sm:grid-cols-none">
          <InputContainer>
            <Label htmlFor="teamName">Nombre del Equipo</Label>
            <Input 
              type="text" 
              id="teamName" 
              placeholder="Nombre del equipo"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </InputContainer>
          <InputContainer>
            <Label className="mt-4" htmlFor="schoolName">Nombre de la Escuela</Label>
            <Input 
              type="text" 
              id="schoolName" 
              placeholder="Nombre de la escuela"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
          </InputContainer>
            <InputContainer>
            <Label htmlFor="schoolName" className="mt-6">Imagen del Equipo</Label>
                <ImageSelector 
                selectedImage={selectedImage} 
                setSelectedImage={setSelectedImage} 
                fallbackText="Selecciona una imagen para el equipo" 
            />
            </InputContainer>
          <Button type="submit" className="mt-5 w-full">Registrar Equipo</Button>
        </form>
      </section>
    </main>
  );
}
