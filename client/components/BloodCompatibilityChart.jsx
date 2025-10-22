import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  Heart,
  Check,
  X
} from "lucide-react";

const bloodTypes = [
  {
    type: "O-",
    canGiveTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-"],
    percentage: 6.6,
    description: "Universal donor - can give to all blood types"
  },
  {
    type: "O+",
    canGiveTo: ["O+", "A+", "B+", "AB+"],
    canReceiveFrom: ["O-", "O+"],
    percentage: 37.4,
    description: "Most common blood type"
  },
  {
    type: "A-",
    canGiveTo: ["A-", "A+", "AB-", "AB+"],
    canReceiveFrom: ["O-", "A-"],
    percentage: 6.3,
    description: "Can donate to A and AB types"
  },
  {
    type: "A+",
    canGiveTo: ["A+", "AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+"],
    percentage: 35.7,
    description: "Second most common blood type"
  },
  {
    type: "B-",
    canGiveTo: ["B-", "B+", "AB-", "AB+"],
    canReceiveFrom: ["O-", "B-"],
    percentage: 1.5,
    description: "Rare blood type, high demand"
  },
  {
    type: "B+",
    canGiveTo: ["B+", "AB+"],
    canReceiveFrom: ["O-", "O+", "B-", "B+"],
    percentage: 8.5,
    description: "Can receive from O and B types"
  },
  {
    type: "AB-",
    canGiveTo: ["AB-", "AB+"],
    canReceiveFrom: ["O-", "A-", "B-", "AB-"],
    percentage: 0.6,
    description: "Rarest blood type"
  },
  {
    type: "AB+",
    canGiveTo: ["AB+"],
    canReceiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    percentage: 3.4,
    description: "Universal recipient - can receive from all types"
  }
];

export default function BloodCompatibilityChart() {
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [viewMode, setViewMode] = useState("give");

  const getBloodTypeInfo = (type) => {
    return bloodTypes.find(bt => bt.type === type);
  };

  const getCompatibilityStatus = (fromType, toType, mode) => {
    const bloodType = getBloodTypeInfo(fromType);
    if (!bloodType) return false;
    
    if (mode === "give") {
      return bloodType.canGiveTo.includes(toType);
    } else {
      return bloodType.canReceiveFrom.includes(toType);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      "O-": "bg-red-500",
      "O+": "bg-red-400",
      "A-": "bg-blue-500",
      "A+": "bg-blue-400",
      "B-": "bg-green-500",
      "B+": "bg-green-400",
      "AB-": "bg-purple-500",
      "AB+": "bg-purple-400"
    };
    return colors[type] || "bg-gray-400";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Blood Type Compatibility Chart
          </CardTitle>
          <CardDescription>
            Interactive chart showing blood donation compatibility between different blood types
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Blood Type Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select a blood type:</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === "give" ? "default" : "outline"}
                  onClick={() => setViewMode("give")}
                >
                  <ArrowRight className="h-4 w-4 mr-1" />
                  Can Give To
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "receive" ? "default" : "outline"}
                  onClick={() => setViewMode("receive")}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Can Receive From
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {bloodTypes.map((bloodType) => (
                <button
                  key={bloodType.type}
                  onClick={() => setSelectedBloodType(bloodType.type)}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${selectedBloodType === bloodType.type 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={`w-8 h-8 rounded-full ${getTypeColor(bloodType.type)} mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold`}>
                    {bloodType.type}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {bloodType.percentage}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Compatibility Matrix */}
          {selectedBloodType && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-semibold">
                  {viewMode === "give" 
                    ? `${selectedBloodType} can donate to:` 
                    : `${selectedBloodType} can receive from:`
                  }
                </h4>
                <Badge variant="outline" className="text-primary border-primary">
                  {getBloodTypeInfo(selectedBloodType)?.description}
                </Badge>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {bloodTypes.map((bloodType) => {
                  const isCompatible = viewMode === "give" 
                    ? getCompatibilityStatus(selectedBloodType, bloodType.type, "give")
                    : getCompatibilityStatus(selectedBloodType, bloodType.type, "receive");

                  return (
                    <div
                      key={bloodType.type}
                      className={`
                        p-4 rounded-lg border-2 relative
                        ${isCompatible 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                        }
                      `}
                    >
                      <div className={`w-8 h-8 rounded-full ${getTypeColor(bloodType.type)} mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold`}>
                        {bloodType.type}
                      </div>
                      <div className="text-xs text-center text-muted-foreground mb-2">
                        {bloodType.percentage}%
                      </div>
                      <div className="absolute top-1 right-1">
                        {isCompatible ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Info */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold mb-2">Blood Type {selectedBloodType} Details:</h5>
                      <p className="text-sm text-muted-foreground">
                        {getBloodTypeInfo(selectedBloodType)?.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-medium text-green-700 mb-2">✓ Can {viewMode === "give" ? "donate to" : "receive from"}:</h6>
                        <div className="flex flex-wrap gap-2">
                          {(viewMode === "give" 
                            ? getBloodTypeInfo(selectedBloodType)?.canGiveTo 
                            : getBloodTypeInfo(selectedBloodType)?.canReceiveFrom
                          )?.map((type) => (
                            <Badge key={type} variant="outline" className="text-green-700 border-green-700">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-muted-foreground mb-2">Population percentage:</h6>
                        <div className="text-2xl font-bold text-primary">
                          {getBloodTypeInfo(selectedBloodType)?.percentage}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          of the Nepali population
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Box */}
          {!selectedBloodType && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">How to use this chart:</p>
                    <ul className="text-blue-700 mt-2 space-y-1">
                      <li>• Click on any blood type to see compatibility</li>
                      <li>• Use "Can Give To" to see who can receive that blood type</li>
                      <li>• Use "Can Receive From" to see who can donate to that blood type</li>
                      <li>• Green indicates compatible, red indicates incompatible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
