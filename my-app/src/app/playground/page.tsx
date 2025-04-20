"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2, Key } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase";

export default function Playground() {
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "입력 오류",
        description: "API 키를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("api_keys")
        .select("key, is_active")
        .eq("key", apiKey)
        .single();

      if (error) throw error;

      if (data) {
        setIsValid(data.is_active);
        setResult(data.is_active ? "SUCCESS" : "INACTIVE");
        toast({
          title: data.is_active ? "성공" : "경고",
          description: data.is_active 
            ? "유효한 API 키입니다." 
            : "비활성화된 API 키입니다.",
          variant: data.is_active ? "default" : "destructive",
        });
      } else {
        setIsValid(false);
        setResult("INVALID");
        toast({
          title: "오류",
          description: "유효하지 않은 API 키입니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API 키 검증 중 오류:", error);
      setIsValid(false);
      setResult("ERROR");
      toast({
        title: "오류 발생",
        description: "API 키 검증 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Playground</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Operational
            </Badge>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">API 키 검증</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>실시간 테스트</span>
                <Badge variant="outline" className="bg-white/50">
                  Beta
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/80"
              onClick={handleValidate}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "검증 중..." : "검증"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">테스트할 API 키</label>
                <div className="relative">
                  <Key className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full h-10 pl-8 pr-4 border rounded-md"
                    placeholder="API 키를 입력하세요..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">결과</label>
                <div className="w-full h-10 p-2 border rounded-md bg-white flex items-center justify-center">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  ) : result ? (
                    <Badge
                      variant="outline"
                      className={
                        isValid === true
                          ? "bg-green-50 text-green-700 border-green-200"
                          : isValid === false
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {result}
                    </Badge>
                  ) : (
                    "결과가 여기에 표시됩니다..."
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 