"use client"
import React from 'react'
import { HeroUIProvider } from "@heroui/react";

const HeroUI = ({ children }) => {
    return (
        <HeroUIProvider>
            {children}
        </HeroUIProvider>
    )
}

export default HeroUI