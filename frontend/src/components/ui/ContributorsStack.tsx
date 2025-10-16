import React from "react";

interface Contributor {
    name: string;
    imageUrl: string;
    profileUrl: string;
}

interface ContributorsStackProps {
    contributors: Contributor[];
}

const ContributorsStack: React.FC<ContributorsStackProps> = ({ contributors }) => {
    return (
        <div className="flex items-center">
            {contributors.map((contributor, index) => (
                <a
                    key={index}
                    href={contributor.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
            relative z-${index} 
            -ml-3 first:ml-0
            transition-all duration-300
            hover:z-50 hover:scale-110 hover:shadow-lg
          `}
                >
                    <img
                        src={contributor.imageUrl}
                        alt={contributor.name}
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                    <span className="sr-only">{contributor.name}</span>
                </a>
            ))}
        </div>
    );
};

export default ContributorsStack;
