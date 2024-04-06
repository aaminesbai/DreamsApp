import React from "react";
import {Text} from 'react-native';

export const predefinedCategories = [
    {
        name: 'Rêves lucides',
        emoji: '🌙',
        content: (
            <Text>
                🌟 Les <Text style={{fontWeight: "bold"}}>rêves lucides</Text> sont une expérience unique où le rêveur
                prend conscience qu’il est en train de rêver tout en restant dans le monde onirique.
                {"\n\n"}
                🧭 Cela permet une exploration consciente et active de l’environnement du rêve. Dans un <Text
                style={{fontWeight: "bold"}}>rêve lucide</Text>, le dormeur peut souvent exercer un certain contrôle sur
                les événements et les actions qui se déroulent, créant ainsi des expériences fascinantes et parfois
                édifiantes.
                {"\n\n"}
                🔮 C’est une porte ouverte vers l’inconscient, où les frontières entre la réalité et l’imaginaire
                s’estompent, offrant des possibilités infinies de découverte et d’auto-exploration.
            </Text>
        )
    },
    {
        name: 'Rêves récurrents',
        emoji: '💭',
        content: (
            <Text>🔄 Les <Text style={{fontWeight: "bold"}}>rêves récurrents</Text> sont des rêves qui se répètent et
                reviennent de manière régulière au fil du temps. Ils peuvent avoir des thèmes, des situations ou des
                motifs spécifiques qui se reproduisent.{"\n\n"}💡 Ces rêves peuvent souvent être interprétés comme des
                messages de l’inconscient ou des indications sur des défis non résolus dans la vie éveillée. Explorer et
                comprendre ces rêves peut offrir un aperçu précieux de soi-même et de ses motivations profondes.{"\n\n"}🌱
                Bien que parfois perturbants, les <Text style={{fontWeight: "bold"}}>rêves récurrents</Text> offrent
                également une opportunité de croissance personnelle et de transformation.</Text>
        )
    },
    {
        name: 'Rêves prémonitoires',
        emoji: '🔮',
        content: (
            <Text>🔮 Les <Text style={{fontWeight: "bold"}}>rêves prémonitoires</Text> sont des rêves qui semblent
                prédire des événements futurs ou fournir des informations sur des situations à venir.{"\n\n"}❓ Bien que
                souvent considérés comme mystérieux et difficiles à expliquer, de nombreux individus rapportent avoir
                vécu des expériences de ce type.{"\n\n"}👁️‍🗨️ Certaines théories suggèrent que les <Text
                    style={{fontWeight: "bold"}}>rêves prémonitoires</Text> pourraient être liés à une sensibilité
                accrue aux signaux subtils de l’environnement ou à une forme de perception extrasensorielle. Quelle que
                soit leur origine, ces rêves suscitent souvent fascination et intrigue.</Text>
        )
    },
    {
        name: 'Rêves éveillés',
        emoji: '☀️',
        content: (
            <Text>🌅 Les <Text style={{fontWeight: "bold"}}>rêves éveillés</Text> sont des expériences de rêve qui se
                produisent pendant les périodes de veille, souvent lors de la méditation, de la relaxation profonde ou
                d’autres états de conscience modifiée.{"\n\n"}🌈 Ces rêves peuvent être caractérisés par une intensité
                accrue des images mentales et des sensations, ainsi que par une clarté inhabituelle de la
                conscience.{"\n\n"}🔍 Les <Text style={{fontWeight: "bold"}}>rêves éveillés</Text> peuvent être utilisés
                comme outil de découverte personnelle et de croissance spirituelle, offrant un accès direct à
                l’inconscient et à ses profondeurs cachées.</Text>
        )
    },
    {
        name: 'Cauchemars',
        emoji: '👻',
        content: (
            <Text>😱 Les <Text style={{fontWeight: "bold"}}>cauchemars</Text> sont des rêves particulièrement effrayants
                et dérangeants qui provoquent souvent de fortes émotions telles que la peur, l’anxiété ou le
                désespoir.{"\n\n"}💤 Ces rêves peuvent survenir à tout moment pendant le sommeil et sont généralement
                associés à des thèmes de danger, de menace ou de traumatisme.{"\n\n"}🕵️‍♂️ Bien que souvent perturbants,
                les <Text style={{fontWeight: "bold"}}>cauchemars</Text> peuvent également offrir une occasion de
                comprendre et de traiter les peurs et les angoisses profondément enfouies.</Text>
        )
    },
];
