"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { ApiKey } from "@/lib/types";
import { Key, Copy, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setError(null);
      console.log('Fetching API keys...');
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`데이터 조회 오류: ${error.message}`);
      }
      
      console.log('Fetched API keys:', data);
      setApiKeys(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      console.error('Error:', errorMessage);
      setError(errorMessage);
      toast({
        title: "오류 발생",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateApiKey = async () => {
    try {
      setError(null);
      console.log('Generating new API key...');
      
      const key = 'ssg_' + Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const newApiKey = {
        name: 'Default',
        key: key,
        type: 'dev' as const,
        is_active: true
      };

      console.log('Attempting to insert new API key:', newApiKey);
      const { data, error } = await supabase
        .from('api_keys')
        .insert([newApiKey])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`API 키 생성 오류: ${error.message}`);
      }

      if (!data) {
        throw new Error('API 키가 생성되었지만 반환된 데이터가 없습니다.');
      }

      console.log('API key created successfully:', data);
      toast({
        title: "성공",
        description: "새로운 API 키가 생성되었습니다.",
      });
      await fetchApiKeys();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      console.error('Error:', errorMessage);
      setError(errorMessage);
      toast({
        title: "오류 발생",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      console.log('Deleting API key:', id);
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('API key deleted successfully');
      toast({
        title: "성공",
        description: "API 키가 삭제되었습니다.",
      });
      fetchApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "오류 발생",
        description: "API 키 삭제에 실패했습니다. 자세한 내용은 콘솔을 확인하세요.",
        variant: "destructive",
      });
    }
  };

  const copyApiKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast({
        title: "성공",
        description: "API 키가 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      console.error("API 키 복사 중 오류:", error);
      toast({
        title: "오류 발생",
        description: "API 키 복사 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Overview</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {error ? "Error" : "Operational"}
            </Badge>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-700 font-semibold mb-2">오류 발생</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Card className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2">Researcher</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>API Usage</span>
                <Badge variant="outline" className="bg-white/50">
                  Free Plan
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="bg-white/80">
              Manage Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-500 h-2 rounded-full w-[5%]"></div>
          </div>
          <div className="text-sm text-gray-600">
            0/1000 Credits
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <Button onClick={generateApiKey} variant="outline">
            <Key className="mr-2 h-4 w-4" />
            + Create New API Key
          </Button>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="grid grid-cols-[1fr_2fr_3fr_1fr] gap-4 w-full">
              <div className="font-medium">NAME</div>
              <div className="font-medium">TYPE</div>
              <div className="font-medium">KEY</div>
              <div className="font-medium text-right">OPTIONS</div>
            </div>
          </div>
          {isLoading ? (
            <div className="py-4 text-center text-gray-500">로딩 중...</div>
          ) : apiKeys.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              생성된 API 키가 없습니다.
            </div>
          ) : (
            apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between py-4 border-b last:border-0">
                <div className="grid grid-cols-[1fr_2fr_3fr_1fr] gap-4 w-full">
                  <div>{apiKey.name}</div>
                  <div>{apiKey.type}</div>
                  <div className="font-mono text-sm">
                    {apiKey.key.slice(0, 10)}...{apiKey.key.slice(-4)}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyApiKey(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteApiKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold mb-2">Story Short Generator API</h3>
          <p className="text-sm text-gray-600 mb-4">
            이 API 키를 사용하여 Story Short Generator API에 요청을 보낼 수 있습니다. 자세한 내용은 문서를 참조하세요.
          </p>
          <Button variant="outline" className="text-sm">
            API 문서 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
