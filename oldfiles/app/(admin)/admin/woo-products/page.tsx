'use client';

import { useEffect, useState } from "react";
import { Card } from "@/app/global/ui/card";
import { Button } from "@/app/global/ui/button";
import api from "@/app/lib/woocommerce";
import { WooCommerceProduct } from "@/app/types/woocommerce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/global/ui/table";
import { Badge } from "@/app/global/ui/badge";

import { 
  Search, 
  Package2, 
  RefreshCw, 
  Tag,
  ShoppingCart,
  BarChart3,
  Archive,
  DollarSign
} from "lucide-react";
import { useToast } from "@/app/global/ui/use-toast";
import {
  Dialog,
  DialogContent,
  
  DialogTitle,
} from "@/app/global/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/global/ui/breadcrumb";
import { Input } from "@/app/global/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/global/ui/select";
import { ScrollArea } from "@/app/global/ui/scroll-area";

export default function WooProductsPage() {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<WooCommerceProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('any');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 25;

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getProducts({
        context: 'view',
        per_page: productsPerPage,
        page: currentPage,
        orderby: 'date',
        order: 'desc',
        status: statusFilter !== 'any' ? statusFilter : undefined,
        search: searchQuery || undefined
      });

      setProducts(response.products);
      setTotalPages(response.totalPages);

      toast({
        title: "Success",
        description: "Products fetched successfully",
      });
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to fetch products. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: WooCommerceProduct) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string): { 
    bg: string; 
    text: string; 
    border: string;
    rowBg: string;
    rowHover: string;
  } => {
    const statusColors: Record<string, { 
      bg: string; 
      text: string; 
      border: string;
      rowBg: string;
      rowHover: string;
    }> = {
      'publish': { 
        bg: 'bg-emerald-500', 
        text: 'text-white font-medium',
        border: 'border-emerald-600',
        rowBg: 'bg-emerald-50/50 dark:bg-emerald-900/10',
        rowHover: 'hover:bg-emerald-100/50 dark:hover:bg-emerald-800/20'
      },
      'draft': { 
        bg: 'bg-amber-500', 
        text: 'text-white font-medium',
        border: 'border-amber-600',
        rowBg: 'bg-amber-50/50 dark:bg-amber-900/10',
        rowHover: 'hover:bg-amber-100/50 dark:hover:bg-amber-800/20'
      },
      'private': { 
        bg: 'bg-violet-500', 
        text: 'text-white font-medium',
        border: 'border-violet-600',
        rowBg: 'bg-violet-50/50 dark:bg-violet-900/10',
        rowHover: 'hover:bg-violet-100/50 dark:hover:bg-violet-800/20'
      },
      'pending': { 
        bg: 'bg-blue-500', 
        text: 'text-white font-medium',
        border: 'border-blue-600',
        rowBg: 'bg-blue-50/50 dark:bg-blue-900/10',
        rowHover: 'hover:bg-blue-100/50 dark:hover:bg-blue-800/20'
      },
      'trash': { 
        bg: 'bg-rose-500', 
        text: 'text-white font-medium',
        border: 'border-rose-600',
        rowBg: 'bg-rose-50/50 dark:bg-rose-900/10',
        rowHover: 'hover:bg-rose-100/50 dark:hover:bg-rose-800/20'
      }
    };
    return statusColors[status] || { 
      bg: 'bg-gray-500', 
      text: 'text-white font-medium',
      border: 'border-gray-600',
      rowBg: 'bg-gray-50/50 dark:bg-gray-900/10',
      rowHover: 'hover:bg-gray-100/50 dark:hover:bg-gray-800/20'
    };
  };

  const getStockStatusColor = (status: WooCommerceProduct['stock_status']): string => {
    const colors: Record<WooCommerceProduct['stock_status'], string> = {
      'instock': 'bg-emerald-500 text-white border-emerald-600',
      'outofstock': 'bg-rose-500 text-white border-rose-600',
      'onbackorder': 'bg-amber-500 text-white border-amber-600'
    };
    return colors[status] || 'bg-gray-500 text-white border-gray-600';
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-2rem)] items-center justify-center m-4">
        <div className="relative">
          <div className="h-24 w-24 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              B
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-2rem)] m-4">
        <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border-red-200/50">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button 
            onClick={fetchProducts}
            variant="outline"
            className="mt-4 border-red-200"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-2rem)] m-4 space-y-4 sm:space-y-6 relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100 via-pink-50/50 to-violet-50/30 dark:from-gray-900 dark:via-violet-900/10 dark:to-pink-900/5" />
        
        <div className="relative space-y-4 sm:space-y-6">
          <Breadcrumb className="z-10 bg-gradient-to-r from-white/70 to-white/50 dark:from-gray-800/70 dark:to-gray-800/50 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-700/80 shadow-lg">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin" className="text-violet-600 dark:text-violet-400" isHome>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>WooCommerce Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="space-y-4 bg-gradient-to-br from-white/50 via-white/30 to-white/50 dark:from-gray-800/50 dark:via-gray-800/30 dark:to-gray-800/50 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/50 p-4 sm:p-6">
            <div className="lg:sticky lg:top-20 z-10 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 bg-gradient-to-b from-white/80 via-white/60 to-transparent dark:from-gray-800/80 dark:via-gray-800/60 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/50 px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4 w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500/50" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full bg-white/50 dark:bg-gray-900/50 border-violet-200/50 dark:border-violet-700/50 focus:border-violet-500 dark:focus:border-violet-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-900/50 border-violet-200/50 dark:border-violet-700/50">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">All Products</SelectItem>
                      <SelectItem value="publish">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={fetchProducts}
                  className="gap-2 whitespace-nowrap bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600 border-0"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-pink-500/5 to-violet-500/5 rounded-xl pointer-events-none" />
              
              <div className="relative overflow-hidden rounded-xl bg-white/50 dark:bg-gray-900/50 border border-white/20 dark:border-gray-700/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950">
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const statusColor = getStatusColor(product.status);
                      return (
                        <TableRow 
                          key={product.id} 
                          className={`cursor-pointer transition-colors ${statusColor.rowBg} ${statusColor.rowHover}`}
                          onClick={() => handleProductClick(product)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.images[0] && (
                                <img 
                                  src={product.images[0].src} 
                                  alt={product.images[0].alt || product.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-white/20"
                                />
                              )}
                              <div>
                                <p className="font-medium bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                                  {product.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ID: {product.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.sku || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStockStatusColor(product.stock_status)}`}>
                              {product.stock_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {product.categories.map((category, ) => (
                                <Badge 
                                  key={category.id}
                                  variant="outline" 
                                  className="bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-300"
                                >
                                  {category.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                            {product.price ? `$${parseFloat(product.price).toFixed(2)}` : 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <div className="p-3 rounded-full bg-gradient-to-r from-violet-100 to-pink-100 dark:from-violet-900/50 dark:to-pink-900/50 mb-2">
                              <Package2 className="h-8 w-8 text-violet-500" />
                            </div>
                            <p>No products found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-violet-50/50 to-pink-50/50 dark:from-violet-950/50 dark:to-pink-950/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                      className="border-violet-200/50 dark:border-violet-700/50"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || loading}
                      className="border-violet-200/50 dark:border-violet-700/50"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl h-[90vh] flex flex-col p-0">
          {selectedProduct && (
            <>
              <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-violet-500/10">
                      <Package2 className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold">
                        {selectedProduct.name}
                      </DialogTitle>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        SKU: {selectedProduct.sku || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(selectedProduct.status).bg} ${getStatusColor(selectedProduct.status).text} border ${getStatusColor(selectedProduct.status).border}`}>
                    {selectedProduct.status}
                  </Badge>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Product Images */}
                  {selectedProduct.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {selectedProduct.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.src}
                          alt={image.alt || selectedProduct.name}
                          className="rounded-xl border border-white/20 aspect-square object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {/* Product Description */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/5 via-violet-500/10 to-pink-500/5 border">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
                  </div>

                  {/* Price & Stock Information */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-blue-500/5 border">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-semibold">Pricing</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Regular Price:</span>{' '}
                          <span className="font-medium">${parseFloat(selectedProduct.regular_price || '0').toFixed(2)}</span>
                        </p>
                        {selectedProduct.sale_price && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Sale Price:</span>{' '}
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              ${parseFloat(selectedProduct.sale_price).toFixed(2)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 via-blue-500/10 to-emerald-500/5 border">
                      <div className="flex items-center gap-2 mb-3">
                        <Archive className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold">Stock</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStockStatusColor(selectedProduct.stock_status)}`}>
                            {selectedProduct.stock_status}
                          </Badge>
                        </div>
                        {selectedProduct.manage_stock && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Stock Quantity:</span>{' '}
                            <span className="font-medium">{selectedProduct.stock_quantity}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Categories & Tags */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedProduct.categories.length > 0 && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/5 via-violet-500/10 to-pink-500/5 border">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                          <h3 className="font-semibold">Categories</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.categories.map((category) => (
                            <Badge
                              key={category.id}
                              variant="outline"
                              className="bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-300"
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.tags.length > 0 && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/5 via-pink-500/10 to-violet-500/5 border">
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                          <h3 className="font-semibold">Tags</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-300"
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sales & Attributes */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/5 via-violet-500/10 to-pink-500/5 border">
                      <div className="flex items-center gap-2 mb-3">
                        <ShoppingCart className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        <h3 className="font-semibold">Sales</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Total Sales:</span>{' '}
                          <span className="font-medium">{selectedProduct.total_sales}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          {selectedProduct.featured && (
                            <Badge variant="outline" className="bg-violet-500/10 border-violet-500/20 text-violet-700 dark:text-violet-300">
                              Featured
                            </Badge>
                          )}
                          {selectedProduct.on_sale && (
                            <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              On Sale
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedProduct.attributes.length > 0 && (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/5 via-pink-500/10 to-violet-500/5 border">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                          <h3 className="font-semibold">Attributes</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedProduct.attributes.map((attribute) => (
                            <div key={attribute.id}>
                              <p className="text-sm font-medium">{attribute.name}:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {attribute.options.map((option, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-300"
                                  >
                                    {option}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 